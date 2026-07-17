import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  deleteUser
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  writeBatch,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { AREAS, UNITS, ACTIVITIES, ACTIVITY_TYPE_LABELS } from "./curriculum.js?v=4.1";

const firebaseConfig = {
  apiKey: "AIzaSyCNCOKfjQf6FHQQj3squE6NZtZYdyuwsLw",
  authDomain: "python-practice-5b289.firebaseapp.com",
  projectId: "python-practice-5b289",
  storageBucket: "python-practice-5b289.firebasestorage.app",
  messagingSenderId: "680319448297",
  appId: "1:680319448297:web:619e79bbbea37764832c78"
};

const APP_VERSION = "4.1";
console.info(`Python Practice v${APP_VERSION}`);

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const elements = Object.fromEntries(
  [...document.querySelectorAll("[id]")].map(element => [element.id, element])
);

let currentProfile = null;
let currentTask = null;
let currentActivity = null;
let currentProgress = new Map();
let customActivities = [];
let allActivities = [...ACTIVITIES];
let selectedAreaId = "sdd";
let editingCustomActivityId = "";
let currentHintIndex = 0;
let pyodide = null;
let pyodidePromise = null;
let accountSetupInProgress = false;
let errorViewMode = "standard";
let traceSteps = [];
let traceIndex = 0;
let tracePlayTimer = null;
let autoSaveTimer = null;
let codeIsDirty = false;
let saveInProgress = false;

const LEGACY_ACTIVITY_MAP = {
  "variables-01": "SDD-PY-02-05",
  "variables-02": "SDD-PY-02-07",
  "variables-03": "SDD-PY-04-04"
};

function showMessage(text, type = "info") {
  elements.messageBox.textContent = text;
  elements.messageBox.className = `message ${type}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearMessage() {
  elements.messageBox.textContent = "";
  elements.messageBox.className = "message hidden";
}

function showView(viewId) {
  ["authView", "teacherView", "pupilView", "activityView", "challengeView"].forEach(id => {
    elements[id].classList.toggle("hidden", id !== viewId);
  });
  elements.homeButton.classList.toggle("hidden", viewId === "authView");
}

function normaliseClassCode(value) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normaliseUsername(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

function pupilInternalEmail(classCode, username) {
  return `${normaliseClassCode(classCode).toLowerCase()}.${normaliseUsername(username)}@students.pythonpractice.app`;
}

function humanDate(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") return "Not yet";
  return timestamp.toDate().toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
  });
}

function statCard(value, label) {
  return `<div class="stat-card"><span class="stat-value">${value}</span><span class="stat-label">${label}</span></div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function unitById(unitId) {
  return UNITS.find(unit => unit.id === unitId) || null;
}

function areaById(areaId) {
  return AREAS.find(area => area.id === areaId) || null;
}

function activityTypeLabel(activity) {
  return ACTIVITY_TYPE_LABELS[activity.type] || "Activity";
}

function sortedActivities(activities = allActivities) {
  return [...activities].sort((a, b) => {
    const unitA = unitById(a.unitId)?.order ?? 999;
    const unitB = unitById(b.unitId)?.order ?? 999;
    return unitA - unitB || Number(a.order || 0) - Number(b.order || 0) || a.title.localeCompare(b.title);
  });
}

function requiredActivities() {
  return sortedActivities().filter(activity => activity.areaId === "sdd" && activity.required !== false && activity.published !== false);
}

function visibleActivities() {
  return sortedActivities().filter(activity => activity.published !== false);
}

function completedActivityIds() {
  return new Set([...currentProgress.entries()].filter(([, progress]) => progress.completed).map(([id]) => id));
}

function previousRequiredActivity(activity) {
  const required = requiredActivities();
  const index = required.findIndex(item => item.id === activity.id);
  return index > 0 ? required[index - 1] : null;
}

function isActivityUnlocked(activity) {
  const progress = currentProgress.get(activity.id);
  if (progress?.completed) return true;
  if (activity.required !== false) {
    const previous = previousRequiredActivity(activity);
    return !previous || currentProgress.get(previous.id)?.completed === true;
  }
  const prerequisites = activity.prerequisiteIds || [];
  if (prerequisites.length) return prerequisites.every(id => currentProgress.get(id)?.completed === true);
  const sameUnitRequired = requiredActivities().filter(item => item.unitId === activity.unitId && Number(item.order) < Number(activity.order));
  const previous = sameUnitRequired.at(-1);
  return !previous || currentProgress.get(previous.id)?.completed === true;
}

function mergeActivities(staticItems, customItems) {
  return sortedActivities([
    ...staticItems,
    ...customItems.map(item => ({
      ...item,
      skills: Array.isArray(item.skills) ? item.skills : [],
      required: item.required === true,
      published: item.published !== false,
      custom: true
    }))
  ]);
}

function customActivityDocumentId() {
  return `custom-${auth.currentUser.uid}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normaliseSkills(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim().toLowerCase()).filter(Boolean);
  return String(value || "").split(",").map(item => item.trim().toLowerCase()).filter(Boolean);
}

function videoEmbedUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  try {
    const parsed = new URL(value);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).at(-1);
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch (_) { /* display as a normal link */ }
  return "";
}

async function ensureTeacherProfile(user) {
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);
  if (existing.exists()) return existing.data();

  const email = (user.email || "").toLowerCase();
  const invite = await getDoc(doc(db, "teacherInvites", email));
  if (!invite.exists() || invite.data().active !== true) {
    throw new Error("This Google account has not been approved as a teacher yet.");
  }

  const profile = {
    role: "teacher",
    displayName: user.displayName || email,
    email,
    createdAt: serverTimestamp()
  };
  await setDoc(userRef, profile);
  return profile;
}

async function loadProfile(user) {
  let snapshot = await getDoc(doc(db, "users", user.uid));
  if (!snapshot.exists() && user.providerData.some(provider => provider.providerId === "google.com")) {
    await ensureTeacherProfile(user);
    snapshot = await getDoc(doc(db, "users", user.uid));
  }
  if (!snapshot.exists()) throw new Error("Your account profile could not be found.");
  return snapshot.data();
}

async function routeSignedInUser(user) {
  try {
    currentProfile = await loadProfile(user);
    elements.signedInControls.classList.remove("hidden");
    elements.currentUserLabel.textContent = currentProfile.displayName || currentProfile.username || "Signed in";
    clearMessage();

    if (currentProfile.role === "teacher") {
      await loadTeacherCustomActivities();
      showView("teacherView");
      await loadTeacherDashboard();
    } else if (currentProfile.role === "student") {
      await loadUserPreferences();
      await loadPupilCustomActivities();
      showView("pupilView");
      await loadPupilDashboard();
    } else {
      throw new Error("This account has an unknown role.");
    }
  } catch (error) {
    console.error(error);
    showMessage(error.message || "The account could not be opened.", "error");
    await signOut(auth);
  }
}

onAuthStateChanged(auth, async user => {
  if (user) {
    if (accountSetupInProgress) return;
    await routeSignedInUser(user);
  } else {
    currentProfile = null;
    currentTask = null;
    currentActivity = null;
    currentProgress = new Map();
    customActivities = [];
    allActivities = [...ACTIVITIES];
    stopTracePlayback();
    clearScheduledAutoSave();
    errorViewMode = "standard";
    elements.signedInControls.classList.add("hidden");
    showView("authView");
  }
});

elements.teacherGoogleButton.addEventListener("click", async () => {
  clearMessage();
  elements.teacherGoogleButton.disabled = true;
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error(error);
    showMessage(error.message || "Google sign-in failed.", "error");
  } finally {
    elements.teacherGoogleButton.disabled = false;
  }
});

elements.pupilLoginTab.addEventListener("click", () => {
  elements.pupilLoginTab.classList.add("active");
  elements.pupilRegisterTab.classList.remove("active");
  elements.pupilLoginForm.classList.remove("hidden");
  elements.pupilRegisterForm.classList.add("hidden");
});

elements.pupilRegisterTab.addEventListener("click", () => {
  elements.pupilRegisterTab.classList.add("active");
  elements.pupilLoginTab.classList.remove("active");
  elements.pupilRegisterForm.classList.remove("hidden");
  elements.pupilLoginForm.classList.add("hidden");
});

elements.pupilLoginForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();
  const code = normaliseClassCode(elements.loginClassCode.value);
  const username = normaliseUsername(elements.loginUsername.value);
  const password = elements.loginPassword.value;

  if (!code || !username) {
    showMessage("Enter a valid class code and username.", "error");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, pupilInternalEmail(code, username), password);
  } catch (error) {
    console.error(error);
    showMessage("The class code, username or password was not recognised.", "error");
  }
});

elements.pupilRegisterForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();

  const code = normaliseClassCode(elements.registerClassCode.value);
  const username = normaliseUsername(elements.registerUsername.value);
  const displayName = elements.registerDisplayName.value.trim();
  const password = elements.registerPassword.value;
  const confirmation = elements.registerPasswordConfirm.value;

  if (code.length < 5 || username.length < 3 || displayName.length < 1) {
    showMessage("Check the class code, display name and username.", "error");
    return;
  }
  if (password.length < 8) {
    showMessage("Choose a password containing at least 8 characters.", "error");
    return;
  }
  if (password !== confirmation) {
    showMessage("The two passwords do not match.", "error");
    return;
  }

  let newUser = null;
  accountSetupInProgress = true;
  try {
    const joinSnapshot = await getDoc(doc(db, "joinCodes", code));
    if (!joinSnapshot.exists() || joinSnapshot.data().active !== true) {
      throw new Error("That class code is not valid.");
    }

    const joinData = joinSnapshot.data();
    const credential = await createUserWithEmailAndPassword(
      auth,
      pupilInternalEmail(code, username),
      password
    );
    newUser = credential.user;

    const batch = writeBatch(db);
    batch.set(doc(db, "users", newUser.uid), {
      role: "student",
      username,
      displayName,
      classId: joinData.classId,
      className: joinData.className,
      joinCode: code,
      createdAt: serverTimestamp()
    });
    batch.set(doc(db, "classes", joinData.classId, "members", newUser.uid), {
      userId: newUser.uid,
      role: "student",
      username,
      displayName,
      joinCode: code,
      joinedAt: serverTimestamp()
    });
    await batch.commit();
    accountSetupInProgress = false;
    showMessage("Account created successfully.", "success");
    await routeSignedInUser(newUser);
  } catch (error) {
    accountSetupInProgress = false;
    console.error(error);
    if (newUser) {
      try { await deleteUser(newUser); } catch (cleanupError) { console.error(cleanupError); }
    }
    const friendly = error.code === "auth/email-already-in-use"
      ? "That username is already being used in this class."
      : (error.message || "The pupil account could not be created.");
    showMessage(friendly, "error");
  }
});

elements.logoutButton.addEventListener("click", async () => {
  if (currentProfile?.role === "student" && currentTask && codeIsDirty) {
    try { await saveProgressDraft({ silent: true }); } catch (_) { /* sign out anyway */ }
  }
  await signOut(auth);
});

elements.homeButton.addEventListener("click", async () => {
  clearMessage();
  if (currentProfile?.role === "teacher") {
    await loadTeacherCustomActivities();
    showView("teacherView");
    await loadTeacherDashboard();
  } else if (currentProfile?.role === "student") {
    if (currentTask && codeIsDirty) {
      try { await saveProgressDraft({ silent: true }); } catch (_) { /* keep navigating */ }
    }
    stopTracePlayback();
    await loadPupilCustomActivities();
    showView("pupilView");
    await loadPupilDashboard();
  }
});

function generateClassCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return [...values].map(value => alphabet[value % alphabet.length]).join("");
}

async function uniqueClassCode() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generateClassCode();
    if (!(await getDoc(doc(db, "joinCodes", code))).exists()) return code;
  }
  throw new Error("A class code could not be generated. Try again.");
}

elements.showCreateClassButton.addEventListener("click", () => {
  elements.createClassPanel.classList.remove("hidden");
  elements.classNameInput.focus();
});

elements.cancelCreateClassButton.addEventListener("click", () => {
  elements.createClassPanel.classList.add("hidden");
  elements.createClassForm.reset();
});

elements.createClassForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();
  const className = elements.classNameInput.value.trim();
  if (!className) return;

  const classRef = doc(collection(db, "classes"));
  let code = null;
  try {
    code = await uniqueClassCode();
    await setDoc(classRef, {
      name: className,
      ownerId: auth.currentUser.uid,
      ownerName: currentProfile.displayName,
      joinCode: code,
      active: true,
      createdAt: serverTimestamp()
    });
    await setDoc(doc(db, "joinCodes", code), {
      classId: classRef.id,
      className,
      ownerId: auth.currentUser.uid,
      active: true,
      createdAt: serverTimestamp()
    });
    elements.createClassForm.reset();
    elements.createClassPanel.classList.add("hidden");
    showMessage(`Class created. The pupil code is ${code}.`, "success");
    await loadTeacherDashboard();
  } catch (error) {
    console.error(error);
    try { await deleteDoc(classRef); } catch (_) { /* ignore cleanup */ }
    showMessage(error.message || "The class could not be created.", "error");
  }
});

function populateContentUnitOptions() {
  if (!elements.contentUnitInput) return;
  elements.contentUnitInput.innerHTML = UNITS
    .filter(unit => unit.areaId === "sdd")
    .sort((a, b) => a.order - b.order)
    .map(unit => `<option value="${escapeHtml(unit.id)}">${unit.number}. ${escapeHtml(unit.title)}</option>`)
    .join("");
}

async function loadTeacherCustomActivities() {
  if (!auth.currentUser || currentProfile?.role !== "teacher") return [];
  const snapshot = await getDocs(query(
    collection(db, "customActivities"),
    where("ownerId", "==", auth.currentUser.uid)
  ));
  customActivities = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  allActivities = mergeActivities(ACTIVITIES, customActivities);
  return customActivities;
}

async function loadPupilCustomActivities() {
  if (!auth.currentUser || currentProfile?.role !== "student") return [];
  const classSnapshot = await getDoc(doc(db, "classes", currentProfile.classId));
  if (!classSnapshot.exists()) {
    customActivities = [];
    allActivities = [...ACTIVITIES];
    return [];
  }
  const ownerId = classSnapshot.data().ownerId;
  const snapshot = await getDocs(query(
    collection(db, "customActivities"),
    where("ownerId", "==", ownerId),
    where("published", "==", true)
  ));
  customActivities = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  allActivities = mergeActivities(ACTIVITIES, customActivities);
  return customActivities;
}

function updateContentTypeFields() {
  const isVideo = elements.contentTypeInput.value === "video";
  elements.contentCheckpointLabel.classList.toggle("hidden", !isVideo);
  elements.contentOptionsLabel.classList.toggle("hidden", !isVideo);
  elements.contentAnswerLabel.classList.toggle("hidden", !isVideo);
  elements.contentYearLabel.classList.toggle("hidden", isVideo);
  elements.contentQuestionLabel.classList.toggle("hidden", isVideo);
}

function resetContentForm() {
  elements.contentActivityForm.reset();
  elements.editingActivityId.value = "";
  editingCustomActivityId = "";
  elements.contentTypeInput.value = "video";
  elements.contentOrderInput.value = "1.5";
  elements.contentYearInput.value = "2025";
  elements.contentAnswerInput.value = "1";
  elements.contentPublishedInput.checked = true;
  elements.contentRequiredInput.checked = false;
  elements.saveContentActivityButton.textContent = "Add activity";
  elements.cancelEditContentButton.classList.add("hidden");
  updateContentTypeFields();
}

function renderCustomContentList() {
  if (!elements.customContentList) return;
  if (!customActivities.length) {
    elements.customContentList.innerHTML = `<p class="help-text">You have not added any videos or official-paper links yet.</p>`;
    return;
  }
  elements.customContentList.innerHTML = "";
  sortedActivities(customActivities).forEach(activity => {
    const unit = unitById(activity.unitId);
    const item = document.createElement("article");
    item.className = "content-item";
    item.innerHTML = `
      <div>
        <h5>${escapeHtml(activity.title)}</h5>
        <p>${escapeHtml(activityTypeLabel(activity))} · Unit ${escapeHtml(unit?.number || "?")} · order ${escapeHtml(activity.order)} · ${activity.published === false ? "Hidden" : "Published"}</p>
      </div>
      <div class="content-item-actions">
        <button type="button" class="secondary edit-content">Edit</button>
        <button type="button" class="secondary toggle-content">${activity.published === false ? "Publish" : "Hide"}</button>
        <button type="button" class="danger-button delete-content">Delete</button>
      </div>`;
    item.querySelector(".edit-content").addEventListener("click", () => beginEditCustomActivity(activity));
    item.querySelector(".toggle-content").addEventListener("click", () => toggleCustomActivity(activity));
    item.querySelector(".delete-content").addEventListener("click", () => deleteCustomActivity(activity));
    elements.customContentList.appendChild(item);
  });
}

function beginEditCustomActivity(activity) {
  editingCustomActivityId = activity.id;
  elements.editingActivityId.value = activity.id;
  elements.contentTypeInput.value = activity.type;
  elements.contentUnitInput.value = activity.unitId;
  elements.contentOrderInput.value = activity.order;
  elements.contentTitleInput.value = activity.title || "";
  elements.contentDescriptionInput.value = activity.description || "";
  elements.contentUrlInput.value = activity.videoUrl || activity.officialUrl || "";
  elements.contentSkillsInput.value = (activity.skills || []).join(", ");
  elements.contentYearInput.value = activity.year || 2025;
  elements.contentQuestionInput.value = activity.questionReference || "";
  elements.contentCheckpointInput.value = activity.checkpoint?.prompt || "";
  elements.contentOptionsInput.value = (activity.checkpoint?.options || []).join("\n");
  elements.contentAnswerInput.value = Number(activity.checkpoint?.answer ?? 0) + 1;
  elements.contentRequiredInput.checked = activity.required === true;
  elements.contentPublishedInput.checked = activity.published !== false;
  elements.saveContentActivityButton.textContent = "Save changes";
  elements.cancelEditContentButton.classList.remove("hidden");
  updateContentTypeFields();
  elements.contentManagerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function toggleCustomActivity(activity) {
  try {
    await setDoc(doc(db, "customActivities", activity.id), {
      published: activity.published === false,
      updatedAt: serverTimestamp()
    }, { merge: true });
    await loadTeacherCustomActivities();
    renderCustomContentList();
    await loadTeacherDashboard();
  } catch (error) {
    console.error(error);
    showMessage(error.message || "The activity could not be updated.", "error");
  }
}

async function deleteCustomActivity(activity) {
  if (!window.confirm(`Delete “${activity.title}”? Existing pupil progress records will remain, but the activity will no longer appear.`)) return;
  try {
    await deleteDoc(doc(db, "customActivities", activity.id));
    if (editingCustomActivityId === activity.id) resetContentForm();
    await loadTeacherCustomActivities();
    renderCustomContentList();
    await loadTeacherDashboard();
  } catch (error) {
    console.error(error);
    showMessage(error.message || "The activity could not be deleted.", "error");
  }
}

elements.showContentManagerButton.addEventListener("click", async () => {
  elements.contentManagerPanel.classList.remove("hidden");
  await loadTeacherCustomActivities();
  renderCustomContentList();
  elements.contentManagerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

elements.closeContentManagerButton.addEventListener("click", () => {
  elements.contentManagerPanel.classList.add("hidden");
  resetContentForm();
});

elements.contentTypeInput.addEventListener("change", updateContentTypeFields);
elements.cancelEditContentButton.addEventListener("click", resetContentForm);

elements.contentActivityForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessage();
  const type = elements.contentTypeInput.value;
  const options = elements.contentOptionsInput.value.split("\n").map(item => item.trim()).filter(Boolean);
  const answer = Math.max(0, Number(elements.contentAnswerInput.value || 1) - 1);
  const id = editingCustomActivityId || customActivityDocumentId();
  const data = {
    ownerId: auth.currentUser.uid,
    areaId: "sdd",
    unitId: elements.contentUnitInput.value,
    type,
    order: Number(elements.contentOrderInput.value || 1.5),
    title: elements.contentTitleInput.value.trim(),
    description: elements.contentDescriptionInput.value.trim(),
    skills: normaliseSkills(elements.contentSkillsInput.value),
    required: elements.contentRequiredInput.checked,
    published: elements.contentPublishedInput.checked,
    estimatedMinutes: type === "video" ? 6 : 10,
    updatedAt: serverTimestamp()
  };
  if (type === "video") {
    data.videoUrl = elements.contentUrlInput.value.trim();
    data.videoTitle = data.title;
    data.checkpoint = elements.contentCheckpointInput.value.trim() && options.length >= 2
      ? { prompt: elements.contentCheckpointInput.value.trim(), options, answer: Math.min(answer, options.length - 1), explanation: "Review the video if you are unsure." }
      : null;
  } else {
    data.officialUrl = elements.contentUrlInput.value.trim();
    data.year = Number(elements.contentYearInput.value || 2025);
    data.questionReference = elements.contentQuestionInput.value.trim();
    data.pageReference = "";
  }
  if (!editingCustomActivityId) data.createdAt = serverTimestamp();
  try {
    await setDoc(doc(db, "customActivities", id), data, { merge: Boolean(editingCustomActivityId) });
    showMessage(editingCustomActivityId ? "Activity updated." : "Activity added to the pathway.", "success");
    resetContentForm();
    await loadTeacherCustomActivities();
    renderCustomContentList();
    await loadTeacherDashboard();
  } catch (error) {
    console.error(error);
    showMessage(error.message || "The activity could not be saved.", "error");
  }
});

populateContentUnitOptions();
resetContentForm();

async function getTeacherClasses() {
  const snapshot = await getDocs(query(
    collection(db, "classes"),
    where("ownerId", "==", auth.currentUser.uid)
  ));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

async function classDataWithStats(classItem) {
  const [memberSnapshot, progressSnapshot] = await Promise.all([
    getDocs(collection(db, "classes", classItem.id, "members")),
    getDocs(query(collection(db, "progress"), where("classId", "==", classItem.id)))
  ]);
  const members = memberSnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  const progress = progressSnapshot.docs.map(item => item.data());
  return { ...classItem, members, progress };
}

async function loadTeacherDashboard() {
  elements.classCards.innerHTML = "<p>Loading classes…</p>";
  elements.classDetailPanel.classList.add("hidden");
  try {
    await loadTeacherCustomActivities();
    const coreIds = new Set(requiredActivities().map(activity => activity.id));
    const coreCount = coreIds.size;
    const classes = await getTeacherClasses();
    const fullClasses = await Promise.all(classes.map(classDataWithStats));
    const pupilCount = fullClasses.reduce((sum, item) => sum + item.members.length, 0);
    const completed = fullClasses.reduce((sum, item) => sum + item.progress.filter(p => p.completed && coreIds.has(p.taskId)).length, 0);
    const attempts = fullClasses.reduce((sum, item) => sum + item.progress.reduce((a, p) => a + (p.attempts || 0), 0), 0);

    elements.teacherSummary.innerHTML = [
      statCard(fullClasses.length, "Classes"),
      statCard(pupilCount, "Pupils"),
      statCard(completed, "Core activities completed"),
      statCard(attempts, "Total attempts")
    ].join("");

    if (!fullClasses.length) {
      elements.classCards.innerHTML = "<div class=\"card\"><p>You have not created a class yet.</p></div>";
      return;
    }

    elements.classCards.innerHTML = "";
    fullClasses.forEach(item => {
      const possible = item.members.length * coreCount;
      const completedCount = item.progress.filter(progress => progress.completed && coreIds.has(progress.taskId)).length;
      const percent = possible ? Math.round((completedCount / possible) * 100) : 0;
      const card = document.createElement("article");
      card.className = "class-card";
      card.innerHTML = `
        <h3>${escapeHtml(item.name)}</h3>
        <p>Class code: <span class="code-chip">${escapeHtml(item.joinCode)}</span></p>
        <p>${item.members.length} pupil${item.members.length === 1 ? "" : "s"}</p>
        <div class="progress-bar"><span style="width:${percent}%"></span></div>
        <p>${percent}% of the required Python pathway completed</p>
        <div class="card-actions"><button>View class</button></div>`;
      card.querySelector("button").addEventListener("click", () => showClassDetails(item));
      elements.classCards.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    elements.classCards.innerHTML = "";
    showMessage(error.message || "The teacher dashboard could not be loaded.", "error");
  }
}


function progressStatus(progress) {
  if (progress?.completed) return { label: "Complete", className: "complete" };
  if ((progress?.attempts || 0) > 0) return { label: "Needs work", className: "needs-work" };
  if (progress?.lastCode !== undefined) return { label: "In progress", className: "working" };
  return { label: "Not started", className: "" };
}

function showClassDetails(classItem) {
  const coreIds = new Set(requiredActivities().map(activity => activity.id));
  const coreCount = coreIds.size;
  elements.classDetailTitle.textContent = classItem.name;
  elements.classDetailMeta.textContent = `Class code: ${classItem.joinCode}`;

  const completedCount = classItem.progress.filter(item => item.completed && coreIds.has(item.taskId)).length;
  const activeCount = classItem.progress.filter(item => !item.completed).length;
  const attempts = classItem.progress.reduce((sum, item) => sum + (item.attempts || 0), 0);
  elements.classStats.innerHTML = [
    statCard(classItem.members.length, "Pupils"),
    statCard(completedCount, "Core activities completed"),
    statCard(activeCount, "Activities in progress")
  ].join("");

  elements.pupilStatsBody.innerHTML = "";
  classItem.members
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .forEach(member => {
      const pupilProgress = classItem.progress.filter(item => item.userId === member.userId);
      const pupilCompleted = pupilProgress.filter(item => item.completed && coreIds.has(item.taskId)).length;
      const pupilInProgress = pupilProgress.filter(item => !item.completed).length;
      const pupilAttempts = pupilProgress.reduce((sum, item) => sum + (item.attempts || 0), 0);
      const pupilFirstTime = pupilProgress.filter(item => item.firstAttemptCorrect === true && coreIds.has(item.taskId)).length;
      const firstTimeRate = pupilCompleted ? Math.round((pupilFirstTime / pupilCompleted) * 100) : 0;
      const last = pupilProgress
        .map(item => item.lastActivityAt || item.lastAttemptAt || item.lastSavedAt)
        .filter(Boolean)
        .sort((a, b) => (b.seconds || 0) - (a.seconds || 0))[0];

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${escapeHtml(member.displayName)}</strong><br><span class="help-text">${escapeHtml(member.username)}</span></td>
        <td>${pupilCompleted}/${coreCount}</td>
        <td>${pupilInProgress}</td>
        <td>${pupilAttempts}</td>
        <td>${firstTimeRate}%</td>
        <td>${humanDate(last)}</td>`;
      elements.pupilStatsBody.appendChild(row);
    });

  if (!classItem.members.length) {
    elements.pupilStatsBody.innerHTML = `<tr><td colspan="6">No pupils have joined yet.</td></tr>`;
  }

  elements.classDetailPanel.classList.remove("hidden");
  elements.classDetailPanel.scrollIntoView({ behavior: "smooth" });
}

elements.closeClassDetailButton.addEventListener("click", () => {
  elements.classDetailPanel.classList.add("hidden");
});

async function loadUserPreferences() {
  if (!auth.currentUser || currentProfile?.role !== "student") return;
  try {
    const snapshot = await getDoc(doc(db, "preferences", auth.currentUser.uid));
    if (snapshot.exists() && ["standard", "friendly"].includes(snapshot.data().errorMode)) {
      errorViewMode = snapshot.data().errorMode;
    } else {
      errorViewMode = "standard";
    }
  } catch (error) {
    console.warn("Preference could not be loaded:", error);
    errorViewMode = "standard";
  }
  applyErrorViewMode();
}

async function saveErrorPreference() {
  if (!auth.currentUser || currentProfile?.role !== "student") return;
  await setDoc(doc(db, "preferences", auth.currentUser.uid), {
    userId: auth.currentUser.uid,
    errorMode: errorViewMode,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

function applyErrorViewMode() {
  const standard = errorViewMode === "standard";
  elements.standardErrorTab.classList.toggle("active", standard);
  elements.friendlyErrorTab.classList.toggle("active", !standard);
  elements.standardErrorBox.classList.toggle("hidden", !standard);
  elements.friendlyErrorBox.classList.toggle("hidden", standard);
}

async function setErrorViewMode(mode) {
  if (!["standard", "friendly"].includes(mode)) return;
  errorViewMode = mode;
  applyErrorViewMode();
  try {
    await saveErrorPreference();
  } catch (error) {
    console.warn("Preference could not be saved:", error);
  }
}

elements.standardErrorTab.addEventListener("click", () => setErrorViewMode("standard"));
elements.friendlyErrorTab.addEventListener("click", () => setErrorViewMode("friendly"));

async function loadPupilProgress() {
  const snapshot = await getDocs(query(
    collection(db, "progress"),
    where("userId", "==", auth.currentUser.uid)
  ));
  const progressItems = snapshot.docs
    .map(item => item.data())
    .filter(item => item.classId === currentProfile.classId);
  currentProgress = new Map(progressItems.map(item => [item.taskId, item]));
  progressItems.forEach(item => {
    const replacementId = LEGACY_ACTIVITY_MAP[item.taskId];
    if (replacementId && !currentProgress.has(replacementId)) {
      currentProgress.set(replacementId, { ...item, taskId: replacementId, activityId: replacementId });
    }
  });
}

function activityStatus(activity) {
  const progress = currentProgress.get(activity.id);
  if (progress?.completed) return { label: "Complete", className: "complete", icon: "✓" };
  if (!isActivityUnlocked(activity)) return { label: "Locked", className: "", icon: "🔒" };
  if ((progress?.attempts || 0) > 0) return { label: "Needs work", className: "needs-work", icon: "!" };
  if (progress?.lastCode !== undefined || progress?.writtenResponse !== undefined || progress?.status === "in_progress") {
    return { label: "In progress", className: "working", icon: "◐" };
  }
  return { label: "Ready", className: "", icon: "○" };
}

function activitiesForUnit(unitId) {
  return visibleActivities().filter(activity => activity.unitId === unitId);
}

function renderAreaCards() {
  elements.areaCards.innerHTML = "";
  AREAS.sort((a, b) => a.order - b.order).forEach(area => {
    const card = document.createElement("article");
    card.className = `area-card ${area.active ? "active-area" : "coming-soon"}`;
    card.innerHTML = `
      <span class="area-badge">${escapeHtml(area.shortTitle)}</span>
      <h3>${escapeHtml(area.title)}</h3>
      <p>${escapeHtml(area.description)}</p>
      <div class="card-actions">
        <button ${area.active ? "" : "disabled"}>${area.active ? "Open pathway" : "Coming later"}</button>
      </div>`;
    if (area.active) {
      card.querySelector("button").addEventListener("click", () => {
        selectedAreaId = area.id;
        elements.pathwayPanel.classList.remove("hidden");
        renderPathway();
        elements.pathwayPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    elements.areaCards.appendChild(card);
  });
}

function renderPathway() {
  const units = UNITS.filter(unit => unit.areaId === selectedAreaId).sort((a, b) => a.order - b.order);
  const core = requiredActivities();
  const firstIncomplete = core.find(activity => !currentProgress.get(activity.id)?.completed && isActivityUnlocked(activity));
  elements.continueActivityButton.disabled = !firstIncomplete;
  elements.continueActivityButton.textContent = firstIncomplete ? `Continue: ${firstIncomplete.title}` : "Pathway complete";
  elements.continueActivityButton.onclick = firstIncomplete ? () => openActivity(firstIncomplete) : null;

  elements.unitList.innerHTML = "";
  units.forEach(unit => {
    const activities = activitiesForUnit(unit.id);
    const unitCore = activities.filter(activity => activity.required !== false);
    const completed = unitCore.filter(activity => currentProgress.get(activity.id)?.completed).length;
    const percent = unitCore.length ? Math.round((completed / unitCore.length) * 100) : 0;
    const unitCard = document.createElement("section");
    unitCard.className = "unit-card";
    unitCard.innerHTML = `
      <div class="unit-header">
        <span class="unit-number">${unit.number}</span>
        <div class="unit-title">
          <h3>${escapeHtml(unit.title)}</h3>
          <p>${escapeHtml(unit.description)}</p>
        </div>
        <div class="unit-progress">
          <span>${completed}/${unitCore.length} required</span>
          <div class="progress-bar"><span style="width:${percent}%"></span></div>
        </div>
      </div>
      <ol class="activity-list"></ol>`;
    const list = unitCard.querySelector(".activity-list");
    activities.forEach((activity, index) => {
      const status = activityStatus(activity);
      const unlocked = isActivityUnlocked(activity);
      const progress = currentProgress.get(activity.id);
      const row = document.createElement("li");
      row.className = `activity-row ${unlocked ? "" : "locked"} ${activity.required === false ? "optional" : ""}`;
      const attempts = progress?.attempts ? ` · ${progress.attempts} attempt${progress.attempts === 1 ? "" : "s"}` : "";
      row.innerHTML = `
        <span class="activity-status-icon" aria-hidden="true">${status.icon}</span>
        <div class="activity-main">
          <h4>${unit.number}.${index + 1} ${escapeHtml(activity.title)}</h4>
          <p>${escapeHtml(activityTypeLabel(activity))} · about ${escapeHtml(activity.estimatedMinutes || 5)} minutes${attempts}</p>
          <div class="activity-meta">
            <span class="activity-chip">${escapeHtml(activityTypeLabel(activity))}</span>
            ${activity.required === false ? '<span class="activity-chip optional">Optional exam practice</span>' : ""}
            ${activity.custom ? '<span class="activity-chip">Teacher added</span>' : ""}
          </div>
        </div>
        <button ${unlocked ? "" : "disabled"}>${progress?.completed ? "Open again" : progress ? "Continue" : activity.type === "official-paper" ? "Open paper task" : "Start"}</button>`;
      row.querySelector("button").addEventListener("click", () => openActivity(activity));
      list.appendChild(row);
    });
    elements.unitList.appendChild(unitCard);
  });
}

async function loadPupilDashboard() {
  await loadPupilCustomActivities();
  await loadPupilProgress();
  currentTask = null;
  currentActivity = null;
  clearScheduledAutoSave();
  stopTracePlayback();
  elements.pupilWelcome.textContent = `Hello, ${currentProfile.displayName}`;
  elements.pupilClassLabel.textContent = currentProfile.className;

  const coreIds = new Set(requiredActivities().map(activity => activity.id));
  const completed = [...currentProgress.entries()].filter(([id, item]) => item.completed && coreIds.has(id)).length;
  const inProgress = [...currentProgress.entries()].filter(([id, item]) => coreIds.has(id) && !item.completed).length;
  const attempts = [...currentProgress.values()].reduce((sum, item) => sum + (item.attempts || 0), 0);
  const coreCount = coreIds.size;
  const percent = coreCount ? Math.round((completed / coreCount) * 100) : 0;
  elements.pupilProgressBadge.textContent = `${completed}/${coreCount} required complete`;
  elements.topicSummary.innerHTML = [
    statCard(`${percent}%`, "Python pathway"),
    statCard(completed, "Required completed"),
    statCard(inProgress, "Started but incomplete"),
    statCard(attempts, "Attempts")
  ].join("");

  renderAreaCards();
  elements.pathwayPanel.classList.remove("hidden");
  renderPathway();
}

function openActivity(activity) {
  if (!isActivityUnlocked(activity)) {
    showMessage("Complete the previous required activity first.", "error");
    return;
  }
  currentActivity = activity;
  if (["code", "debug", "visualiser"].includes(activity.type)) {
    openTask(activity);
  } else {
    renderGenericActivity(activity);
  }
}

function baseGenericProgressData(activity, old = {}) {
  return {
    classId: currentProfile.classId,
    userId: auth.currentUser.uid,
    taskId: activity.id,
    activityId: activity.id,
    taskTitle: activity.title,
    activityTitle: activity.title,
    activityType: activity.type,
    unitId: activity.unitId,
    areaId: activity.areaId,
    topic: unitById(activity.unitId)?.title || activity.topic || "",
    completed: Boolean(old.completed),
    attempts: old.attempts || 0,
    incorrectAttempts: old.incorrectAttempts || 0,
    hintsUsed: old.hintsUsed || 0,
    firstAttemptCorrect: Boolean(old.firstAttemptCorrect),
    visualiserUses: old.visualiserUses || 0,
    errorCounts: old.errorCounts || {}
  };
}

async function saveGenericProgress(activity, updates = {}, { countAttempt = false, correct = false } = {}) {
  const progressRef = doc(db, "progress", progressDocumentId(activity.id));
  const old = currentProgress.get(activity.id) || {};
  const attempts = countAttempt ? (old.attempts || 0) + 1 : (old.attempts || 0);
  const completed = Boolean(old.completed || updates.completed || correct);
  const data = {
    ...baseGenericProgressData(activity, old),
    ...updates,
    completed,
    status: completed ? "complete" : (countAttempt ? "needs_work" : "in_progress"),
    attempts,
    incorrectAttempts: (old.incorrectAttempts || 0) + (countAttempt && !correct ? 1 : 0),
    firstAttemptCorrect: countAttempt && (old.attempts || 0) === 0 ? Boolean(correct) : Boolean(old.firstAttemptCorrect),
    lastActivityAt: serverTimestamp(),
    lastSavedAt: serverTimestamp()
  };
  await setDoc(progressRef, data, { merge: currentProgress.has(activity.id) });
  currentProgress.set(activity.id, { ...old, ...data });
  return data;
}

function setGenericFeedback(text, type = "info") {
  elements.activityFeedback.textContent = text;
  elements.activityFeedback.className = `feedback ${type}`;
}

function setGenericStatus(activity) {
  const status = activityStatus(activity);
  elements.activityStatus.textContent = status.label;
  elements.activityStatus.className = `status-pill ${status.className}`;
}

function renderRelatedPractice(activity, targetElement) {
  const skills = new Set(activity.skills || []);
  const related = visibleActivities()
    .filter(item => item.type === "official-paper" && item.id !== activity.id)
    .map(item => ({ item, score: (item.skills || []).filter(skill => skills.has(skill)).length }))
    .filter(result => result.score > 0 && isActivityUnlocked(result.item))
    .sort((a, b) => b.score - a.score || Number(a.item.order) - Number(b.item.order))
    .slice(0, 2)
    .map(result => result.item);

  if (!related.length) {
    targetElement.classList.add("hidden");
    targetElement.innerHTML = "";
    return;
  }
  targetElement.classList.remove("hidden");
  targetElement.innerHTML = `<h3>Related official-paper practice</h3><p>These official questions use skills you have practised.</p><div class="related-grid"></div>`;
  const grid = targetElement.querySelector(".related-grid");
  related.forEach(item => {
    const card = document.createElement("article");
    card.className = "related-item";
    card.innerHTML = `<h4>${escapeHtml(item.year || "")} ${escapeHtml(item.questionReference || item.title)}</h4><p>${escapeHtml(item.pageReference || "Open the official paper")}</p><button type="button">Open activity</button>`;
    card.querySelector("button").addEventListener("click", () => openActivity(item));
    grid.appendChild(card);
  });
}

function checkpointMarkup(checkpoint, prefix = "checkpoint") {
  if (!checkpoint?.prompt || !Array.isArray(checkpoint.options) || checkpoint.options.length < 2) return "";
  return `<div class="activity-question"><fieldset class="question-block"><legend>${escapeHtml(checkpoint.prompt)}</legend>${checkpoint.options.map((option, index) => `
    <label class="option-label"><input type="radio" name="${prefix}" value="${index}"> <span>${escapeHtml(option)}</span></label>`).join("")}</fieldset><button id="checkCheckpointButton" type="button">Check answer</button></div>`;
}

function renderGenericActivity(activity) {
  currentTask = null;
  currentActivity = activity;
  clearMessage();
  const unit = unitById(activity.unitId);
  elements.activityTypeLabel.textContent = activityTypeLabel(activity);
  elements.activityTitle.textContent = activity.title;
  elements.activityUnitLabel.textContent = `Unit ${unit?.number || ""}: ${unit?.title || ""}`;
  elements.activityContent.innerHTML = "";
  elements.activityInteraction.innerHTML = "";
  elements.activityFeedback.className = "feedback hidden";
  elements.activityFeedback.textContent = "";
  setGenericStatus(activity);

  const progress = currentProgress.get(activity.id) || {};

  if (activity.type === "lesson" || activity.type === "video") {
    const embed = videoEmbedUrl(activity.videoUrl);
    elements.activityContent.innerHTML = `
      ${activity.description ? `<p>${escapeHtml(activity.description)}</p>` : ""}
      ${activity.videoUrl ? (embed
        ? `<iframe class="video-frame" src="${escapeHtml(embed)}" title="${escapeHtml(activity.videoTitle || activity.title)}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
        : `<div class="video-placeholder"><p>This video opens on its hosting website.</p><a class="button-link" href="${escapeHtml(activity.videoUrl)}" target="_blank" rel="noopener">Open video explanation</a></div>`)
        : `<div class="video-placeholder"><strong>Video space ready</strong><p>Your teacher can add a video from the Content Manager. Use the explanation below for now.</p></div>`}
      <div class="instructions">${activity.contentHtml || ""}</div>`;
    if (activity.checkpoint) {
      elements.activityInteraction.innerHTML = checkpointMarkup(activity.checkpoint, `checkpoint-${activity.id}`);
      elements.activityInteraction.querySelector("#checkCheckpointButton").addEventListener("click", async () => {
        const selected = elements.activityInteraction.querySelector(`input[name="checkpoint-${CSS.escape(activity.id)}"]:checked`);
        if (!selected) return setGenericFeedback("Choose an answer first.", "error");
        const correct = Number(selected.value) === Number(activity.checkpoint.answer);
        await saveGenericProgress(activity, { checkpointAnswer: Number(selected.value) }, { countAttempt: true, correct });
        if (correct) {
          setGenericFeedback(`Correct. ${activity.checkpoint.explanation || "Activity complete."}`, "success");
          setGenericStatus(activity);
          renderRelatedPractice(activity, elements.activityRelatedPractice);
        } else {
          setGenericFeedback("Not yet. Review the explanation or video and try again.", "error");
        }
      });
    } else {
      elements.activityInteraction.innerHTML = `<div class="activity-actions"><button id="completeLessonButton" type="button">Mark as complete</button></div>`;
      elements.activityInteraction.querySelector("#completeLessonButton").addEventListener("click", async () => {
        await saveGenericProgress(activity, { completed: true }, { correct: true });
        setGenericFeedback("Lesson marked complete.", "success");
        setGenericStatus(activity);
        renderRelatedPractice(activity, elements.activityRelatedPractice);
      });
    }
  } else if (activity.type === "quiz" || activity.type === "predict") {
    elements.activityContent.innerHTML = `${activity.codeSnippet ? `<pre class="lesson-code">${escapeHtml(activity.codeSnippet)}</pre>` : ""}`;
    elements.activityInteraction.innerHTML = (activity.questions || []).map((question, questionIndex) => `
      <fieldset class="question-block">
        <legend>${questionIndex + 1}. ${escapeHtml(question.prompt)}</legend>
        ${question.options.map((option, optionIndex) => `<label class="option-label"><input type="radio" name="question-${questionIndex}" value="${optionIndex}"> <span>${escapeHtml(option)}</span></label>`).join("")}
      </fieldset>`).join("") + `<button id="checkQuizButton" type="button">Check answers</button>`;
    elements.activityInteraction.querySelector("#checkQuizButton").addEventListener("click", async () => {
      const answers = [];
      let allAnswered = true;
      let correct = true;
      (activity.questions || []).forEach((question, questionIndex) => {
        const selected = elements.activityInteraction.querySelector(`input[name="question-${questionIndex}"]:checked`);
        if (!selected) { allAnswered = false; return; }
        answers.push(Number(selected.value));
        if (Number(selected.value) !== Number(question.answer)) correct = false;
      });
      if (!allAnswered) return setGenericFeedback("Answer every question before checking.", "error");
      await saveGenericProgress(activity, { quizAnswers: answers }, { countAttempt: true, correct });
      if (correct) {
        setGenericFeedback("All answers are correct. Activity complete.", "success");
        setGenericStatus(activity);
        renderRelatedPractice(activity, elements.activityRelatedPractice);
      } else {
        const explanations = (activity.questions || []).map((question, index) => `${index + 1}. ${question.explanation || "Review this question."}`).join("\n");
        setGenericFeedback(`Not all answers are correct.\n\n${explanations}`, "error");
      }
    });
  } else if (activity.type === "exam-style") {
    elements.activityContent.innerHTML = activity.questionHtml || `<p>${escapeHtml(activity.description || "Complete the exam-style question.")}</p>`;
    elements.activityInteraction.innerHTML = `
      <label>Your answer
        <textarea id="writtenResponseInput" class="written-response" placeholder="Write your answer before revealing the marking points.">${escapeHtml(progress.writtenResponse || "")}</textarea>
      </label>
      <div class="activity-actions">
        <button id="saveWrittenResponseButton" type="button" class="save-button">Save progress</button>
        <button id="revealMarkingButton" type="button" class="secondary">Reveal marking points</button>
      </div>
      <div id="markingPointsPanel" class="marking-points hidden"></div>`;
    const responseInput = elements.activityInteraction.querySelector("#writtenResponseInput");
    elements.activityInteraction.querySelector("#saveWrittenResponseButton").addEventListener("click", async () => {
      await saveGenericProgress(activity, { writtenResponse: responseInput.value });
      setGenericFeedback("Your answer has been saved. This does not mark it complete.", "success");
      setGenericStatus(activity);
    });
    elements.activityInteraction.querySelector("#revealMarkingButton").addEventListener("click", async () => {
      if (!responseInput.value.trim()) return setGenericFeedback("Write an answer before revealing the marking points.", "error");
      await saveGenericProgress(activity, { writtenResponse: responseInput.value, markingPointsViewed: true });
      const panel = elements.activityInteraction.querySelector("#markingPointsPanel");
      panel.classList.remove("hidden");
      panel.innerHTML = `<h3>Marking points</h3><ul>${(activity.markingPoints || []).map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul>${activity.modelAnswer ? `<p><strong>Model answer:</strong> ${escapeHtml(activity.modelAnswer)}</p>` : ""}<button id="selfMarkCompleteButton" type="button">I have checked my answer</button>`;
      panel.querySelector("#selfMarkCompleteButton").addEventListener("click", async () => {
        await saveGenericProgress(activity, { completed: true, writtenResponse: responseInput.value, selfMarked: true }, { correct: true });
        setGenericFeedback("Exam practice marked complete.", "success");
        setGenericStatus(activity);
        renderRelatedPractice(activity, elements.activityRelatedPractice);
      });
    });
  } else if (activity.type === "official-paper") {
    elements.activityContent.innerHTML = `
      <div class="official-paper-box">
        <h3>${escapeHtml(activity.year || "Official")} National 5 Computing Science</h3>
        <p><strong>${escapeHtml(activity.questionReference || activity.title)}</strong>${activity.pageReference ? ` · ${escapeHtml(activity.pageReference)}` : ""}</p>
        <p>${escapeHtml(activity.description || "Open the official paper and attempt the referenced question.")}</p>
        <p class="help-text">The question is not copied into this app. It opens on the official awarding-body website.</p>
        <div class="activity-actions">
          <a id="openOfficialPaperLink" class="button-link" href="${escapeHtml(activity.officialUrl)}" target="_blank" rel="noopener">Open official paper</a>
          <button id="completeOfficialButton" type="button">I have completed the question</button>
        </div>
      </div>`;
    elements.activityContent.querySelector("#openOfficialPaperLink").addEventListener("click", async () => {
      try { await saveGenericProgress(activity, { paperOpened: true, paperOpenedAt: serverTimestamp() }); } catch (error) { console.warn(error); }
      setGenericStatus(activity);
    });
    elements.activityContent.querySelector("#completeOfficialButton").addEventListener("click", async () => {
      await saveGenericProgress(activity, { completed: true, paperOpened: true }, { correct: true });
      setGenericFeedback("Official-paper practice marked complete.", "success");
      setGenericStatus(activity);
    });
  }

  renderRelatedPractice(activity, elements.activityRelatedPractice);
  showView("activityView");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

elements.backFromActivityButton.addEventListener("click", async () => {
  showView("pupilView");
  await loadPupilDashboard();
});

function clearTaskPanels() {
  elements.outputBox.textContent = "Press Run to test your program.";
  elements.feedbackBox.className = "feedback hidden";
  elements.feedbackBox.textContent = "";
  hideExecutionError();
  elements.visualiserPanel.classList.add("hidden");
  traceSteps = [];
  traceIndex = 0;
  stopTracePlayback();
}

function openTask(task) {
  currentTask = task;
  currentActivity = task;
  currentHintIndex = 0;
  clearScheduledAutoSave();
  const progress = currentProgress.get(task.id);
  const status = activityStatus(task);
  const unit = unitById(task.unitId);
  elements.challengeTopic.textContent = `${activityTypeLabel(task)} · Unit ${unit?.number || ""} ${unit?.title || task.topic || ""}`;
  elements.challengeTitle.textContent = task.title;
  elements.challengeInstructions.innerHTML = task.instructions;
  elements.expectedOutput.textContent = task.expectedOutput;
  elements.codeEditor.value = progress?.lastCode ?? task.starterCode;
  elements.challengeStatus.textContent = status.label;
  elements.challengeStatus.className = `status-pill ${status.className}`;
  if (Array.isArray(task.sampleInputs) && task.sampleInputs.length) {
    elements.sampleInputNote.textContent = `The Run and Visualise buttons will use this sample keyboard input: ${task.sampleInputs.join(", ")}. Check answer also uses hidden test values.`;
    elements.sampleInputNote.classList.remove("hidden");
  } else {
    elements.sampleInputNote.textContent = "";
    elements.sampleInputNote.classList.add("hidden");
  }
  codeIsDirty = false;
  setSaveStatus(progress ? "saved" : "idle", progress ? "Saved progress loaded" : "No unsaved changes");
  clearTaskPanels();
  renderRelatedPractice(task, elements.challengeRelatedPractice);
  showView("challengeView");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

elements.backToTasksButton.addEventListener("click", async () => {
  if (currentTask && codeIsDirty) {
    try { await saveProgressDraft({ silent: true }); } catch (_) { /* continue */ }
  }
  stopTracePlayback();
  showView("pupilView");
  await loadPupilDashboard();
});

elements.resetButton.addEventListener("click", () => {
  if (!currentTask) return;
  elements.codeEditor.value = currentTask.starterCode;
  clearTaskPanels();
  markCodeDirty();
});

elements.hintButton.addEventListener("click", async () => {
  if (!currentTask) return;
  const hint = currentTask.hints[Math.min(currentHintIndex, currentTask.hints.length - 1)];
  currentHintIndex += 1;
  elements.feedbackBox.textContent = `Hint: ${hint}`;
  elements.feedbackBox.className = "feedback info";
  try {
    await saveHintUse();
  } catch (error) {
    console.error("Hint save failed:", error);
  }
});

elements.codeEditor.addEventListener("keydown", event => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = elements.codeEditor.selectionStart;
    const end = elements.codeEditor.selectionEnd;
    elements.codeEditor.value = elements.codeEditor.value.slice(0, start) + "    " + elements.codeEditor.value.slice(end);
    elements.codeEditor.selectionStart = elements.codeEditor.selectionEnd = start + 4;
    markCodeDirty();
  }
});

elements.codeEditor.addEventListener("input", markCodeDirty);

function clearScheduledAutoSave() {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
}

function setSaveStatus(state, text) {
  elements.saveStatus.className = `save-status ${state === "idle" ? "" : state}`;
  elements.saveStatus.textContent = text;
}

function markCodeDirty() {
  if (!currentTask || currentProfile?.role !== "student") return;
  codeIsDirty = true;
  setSaveStatus("unsaved", "Unsaved changes");
  clearScheduledAutoSave();
  autoSaveTimer = setTimeout(async () => {
    autoSaveTimer = null;
    if (!codeIsDirty) return;
    try {
      await saveProgressDraft({ silent: true, automatic: true });
    } catch (error) {
      console.error("Autosave failed:", error);
      setSaveStatus("error", "Autosave failed — use Save progress");
    }
  }, 5000);
}

function progressDocumentId(taskId) {
  return `${currentProfile.classId}_${auth.currentUser.uid}_${taskId}`;
}

function baseProgressData(task, old = {}) {
  return {
    classId: currentProfile.classId,
    userId: auth.currentUser.uid,
    taskId: task.id,
    activityId: task.id,
    taskTitle: task.title,
    activityTitle: task.title,
    activityType: task.type || "code",
    unitId: task.unitId || "",
    areaId: task.areaId || "sdd",
    topic: unitById(task.unitId)?.title || task.topic || "",
    completed: Boolean(old.completed),
    attempts: old.attempts || 0,
    incorrectAttempts: old.incorrectAttempts || 0,
    hintsUsed: old.hintsUsed || 0,
    firstAttemptCorrect: Boolean(old.firstAttemptCorrect),
    visualiserUses: old.visualiserUses || 0,
    errorCounts: old.errorCounts || {}
  };
}

async function saveProgressDraft({ silent = false, automatic = false } = {}) {
  if (!currentTask || !auth.currentUser || currentProfile?.role !== "student" || saveInProgress) return;
  saveInProgress = true;
  clearScheduledAutoSave();
  setSaveStatus("saving", automatic ? "Autosaving…" : "Saving…");
  elements.saveProgressButton.disabled = true;
  const progressRef = doc(db, "progress", progressDocumentId(currentTask.id));
  const old = currentProgress.get(currentTask.id) || {};
  const data = {
    ...baseProgressData(currentTask, old),
    status: old.completed ? "complete" : (old.attempts || 0) > 0 ? "needs_work" : "in_progress",
    lastCode: elements.codeEditor.value,
    lastSavedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };
  try {
    await setDoc(progressRef, data, { merge: currentProgress.has(currentTask.id) });
    currentProgress.set(currentTask.id, { ...old, ...data });
    codeIsDirty = false;
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setSaveStatus("saved", `${automatic ? "Autosaved" : "Saved"} at ${time}`);
    if (!old.completed) {
      elements.challengeStatus.textContent = (old.attempts || 0) > 0 ? "Needs work" : "In progress";
      elements.challengeStatus.className = `status-pill ${(old.attempts || 0) > 0 ? "needs-work" : "working"}`;
    }
    if (!silent) {
      elements.feedbackBox.textContent = "Progress saved. This does not count as an attempt.";
      elements.feedbackBox.className = "feedback success";
    }
  } finally {
    saveInProgress = false;
    elements.saveProgressButton.disabled = false;
  }
}

elements.saveProgressButton.addEventListener("click", async () => {
  try {
    await saveProgressDraft();
  } catch (error) {
    console.error("Save progress failed:", error);
    const code = error.code ? ` [${error.code}]` : "";
    setSaveStatus("error", "Progress was not saved");
    elements.feedbackBox.textContent = `${error.message || "Progress could not be saved."}${code}`;
    elements.feedbackBox.className = "feedback error";
  }
});

async function ensurePyodide() {
  if (pyodide) return pyodide;
  if (!pyodidePromise) {
    elements.pythonStatus.textContent = "Loading Python…";
    pyodidePromise = loadPyodide().then(instance => {
      pyodide = instance;
      elements.pythonStatus.textContent = "Python is ready.";
      return instance;
    }).catch(error => {
      pyodidePromise = null;
      elements.pythonStatus.textContent = "Python could not load.";
      throw error;
    });
  }
  return pyodidePromise;
}

async function runCode(code, inputs = []) {
  const python = await ensurePyodide();
  python.globals.set("student_code", code);
  python.globals.set("input_values_json", JSON.stringify((inputs || []).map(value => String(value))));
  const raw = await python.runPythonAsync(`
import io, sys, traceback, json
_buffer = io.StringIO()
_old_stdout, _old_stderr = sys.stdout, sys.stderr
sys.stdout = _buffer
sys.stderr = _buffer
_error = None
_steps = {"count": 0}
_input_values = json.loads(input_values_json)
_input_index = {"value": 0}

def _safe_input(prompt=""):
    if prompt:
        print(str(prompt), end="")
    if _input_index["value"] >= len(_input_values):
        raise EOFError("No more test input values were supplied by the app.")
    value = str(_input_values[_input_index["value"]])
    _input_index["value"] += 1
    print(value)
    return value

def _guard(frame, event, arg):
    if frame.f_code.co_filename == "<student>" and event == "line":
        _steps["count"] += 1
        if _steps["count"] > 12000:
            raise RuntimeError("Stopped: too many steps (possible infinite loop).")
    return _guard

try:
    _compiled = compile(student_code, "<student>", "exec")
    sys.settrace(_guard)
    _env = {"__name__": "__main__", "input": _safe_input}
    exec(_compiled, _env, _env)
except BaseException:
    _error = traceback.format_exc()
finally:
    sys.settrace(None)
    sys.stdout, sys.stderr = _old_stdout, _old_stderr
json.dumps({"output": _buffer.getvalue(), "error": _error, "inputsUsed": _input_index["value"]})
  `);
  return JSON.parse(String(raw));
}

async function gradeCode(code, task, output) {
  const python = await ensurePyodide();
  python.globals.set("student_code", code);
  python.globals.set("requirements_json", JSON.stringify(task.requirements || {}));
  python.globals.set("expected_output", task.expectedOutput);
  python.globals.set("actual_output", output);

  const raw = await python.runPythonAsync(`
import ast, json
requirements = json.loads(requirements_json)
feedback = []
try:
    tree = ast.parse(student_code)
except SyntaxError as error:
    _result = json.dumps({"correct": False, "feedback": ["Syntax error on line " + str(error.lineno) + ": " + str(error.msg)]})
else:
    def literal(node):
        try:
            return ast.literal_eval(node)
        except Exception:
            return object()

    def assignment_found(name, value):
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                targets = [target.id for target in node.targets if isinstance(target, ast.Name)]
                if name in targets and literal(node.value) == value:
                    return True
        return False

    for name, value in requirements.get("assignments", {}).items():
        if not assignment_found(name, value):
            feedback.append("Create " + name + " and set it to " + repr(value) + ".")

    operation = requirements.get("binOperation")
    if operation:
        operator_class = getattr(ast, operation["operator"])
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.BinOp) and isinstance(node.op, operator_class):
                names = {child.id for child in ast.walk(node) if isinstance(child, ast.Name)}
                if set(operation.get("names", [])).issubset(names):
                    found = True
                    break
        if not found:
            feedback.append("Use the required variables in the calculation rather than printing a fixed answer.")

    required_names = set(requirements.get("requiredNamesInCalculation", []))
    required_ops = requirements.get("requiredOperators", [])
    if required_names or required_ops:
        calc_names = set()
        calc_ops = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.BinOp):
                calc_names.update(child.id for child in ast.walk(node) if isinstance(child, ast.Name))
                calc_ops.add(type(node.op).__name__)
        if not required_names.issubset(calc_names):
            feedback.append("Use all of the named variables in your calculation.")
        for operator_name in required_ops:
            if operator_name not in calc_ops:
                feedback.append("Your calculation needs a " + operator_name + " operation.")

    for node_name in requirements.get("requiredNodes", []):
        node_class = getattr(ast, node_name)
        if not any(isinstance(node, node_class) for node in ast.walk(tree)):
            feedback.append("Use a " + node_name.lower() + " statement as requested.")

    if_names = set(requirements.get("ifUsesNames", []))
    if if_names:
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.If):
                names = {child.id for child in ast.walk(node.test) if isinstance(child, ast.Name)}
                if if_names.issubset(names):
                    found = True
                    break
        if not found:
            feedback.append("Use the named variable in the if condition.")

    comparison = requirements.get("comparison")
    if comparison:
        op_class = getattr(ast, comparison["operator"])
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.Compare) and isinstance(node.left, ast.Name) and node.left.id == comparison["name"]:
                if node.ops and isinstance(node.ops[0], op_class) and node.comparators and literal(node.comparators[0]) == comparison["value"]:
                    found = True
                    break
        if not found:
            feedback.append("Check the variable, comparison operator and value in your condition.")

    range_args = requirements.get("rangeArgs")
    if range_args is not None:
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "range":
                if [literal(arg) for arg in node.args] == range_args:
                    found = True
                    break
        if not found:
            feedback.append("Use range(" + ", ".join(map(str, range_args)) + ").")

    iter_name = requirements.get("forIteratesName")
    if iter_name:
        found = any(isinstance(node, ast.For) and isinstance(node.iter, ast.Name) and node.iter.id == iter_name for node in ast.walk(tree))
        if not found:
            feedback.append("Traverse the " + iter_name + " array with your loop.")

    update_name = requirements.get("updatesVariable")
    if update_name:
        found = False
        for node in ast.walk(tree):
            if isinstance(node, ast.AugAssign) and isinstance(node.target, ast.Name) and node.target.id == update_name and isinstance(node.op, ast.Add):
                found = True
            if isinstance(node, ast.Assign):
                targets = [target.id for target in node.targets if isinstance(target, ast.Name)]
                if update_name in targets and isinstance(node.value, ast.BinOp) and isinstance(node.value.op, ast.Add):
                    names = {child.id for child in ast.walk(node.value) if isinstance(child, ast.Name)}
                    if update_name in names:
                        found = True
        if not found:
            feedback.append("Update " + update_name + " inside the loop to create a running total.")

    required_calls = set(requirements.get("requiredCalls", []))
    calls_found = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            calls_found.append(node.func.id)
    for call_name in required_calls:
        if call_name not in calls_found:
            feedback.append("Use " + call_name + "() as requested.")

    min_print_calls = int(requirements.get("minPrintCalls", 0) or 0)
    if min_print_calls and calls_found.count("print") < min_print_calls:
        feedback.append("Use at least " + str(min_print_calls) + " print() instructions.")

    required_strings = set(requirements.get("requiredStringLiterals", []))
    string_literals = {node.value for node in ast.walk(tree) if isinstance(node, ast.Constant) and isinstance(node.value, str)}
    for value in required_strings:
        if value not in string_literals:
            feedback.append("Include the required text " + repr(value) + " in your program.")

    required_print_names = set(requirements.get("requiredPrintNames", []))
    if required_print_names:
        printed_names = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "print":
                printed_names.update(child.id for child in ast.walk(node) if isinstance(child, ast.Name))
        for name in required_print_names:
            if name not in printed_names:
                feedback.append("Display the value stored in " + name + " rather than a fixed answer.")

    forbidden = set(requirements.get("forbiddenCalls", []))
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in forbidden:
            feedback.append("Do not use " + node.func.id + "() for this task.")

    if expected_output and actual_output.strip() != expected_output.strip():
        feedback.append("The output should be exactly: " + repr(expected_output) + ".")

    _result = json.dumps({"correct": len(feedback) == 0, "feedback": feedback})
_result
  `);
  return JSON.parse(String(raw));
}

async function runTaskTests(code, task) {
  const tests = Array.isArray(task.tests) && task.tests.length
    ? task.tests
    : [{ inputs: task.sampleInputs || [], expectedOutput: task.expectedOutput }];
  const failures = [];
  let firstExecution = null;
  for (let index = 0; index < tests.length; index += 1) {
    const test = tests[index];
    const execution = await runCode(code, test.inputs || []);
    if (!firstExecution) firstExecution = execution;
    if (execution.error) {
      return {
        correct: false,
        feedback: [`Test ${index + 1} stopped with a Python error.`],
        firstExecution,
        error: execution.error
      };
    }
    if (String(execution.output || "").trim() !== String(test.expectedOutput || "").trim()) {
      failures.push(`Test ${index + 1} did not produce the expected output.`);
    }
  }
  return {
    correct: failures.length === 0,
    feedback: failures,
    firstExecution,
    error: null
  };
}

function parsePythonError(tracebackText) {
  const text = String(tracebackText || "").trim();
  const lines = text.split("\n").map(line => line.trimEnd()).filter(Boolean);
  const finalLine = lines.at(-1) || "RuntimeError: The program stopped.";
  const typeMatch = finalLine.match(/^([A-Za-z][A-Za-z0-9_]*Error|SystemExit|KeyboardInterrupt):?\s*(.*)$/);
  const errorType = typeMatch?.[1] || "RuntimeError";
  const detail = typeMatch?.[2] || finalLine;
  const lineMatches = [...text.matchAll(/File "<student>", line (\d+)/g)];
  const lineNumber = lineMatches.length ? Number(lineMatches.at(-1)[1]) : null;
  return { text, finalLine, errorType, detail, lineNumber };
}

function friendlyErrorExplanation(tracebackText) {
  const parsed = parsePythonError(tracebackText);
  const lineText = parsed.lineNumber ? `The error happened on line ${parsed.lineNumber}.\n\n` : "";
  const messages = {
    SyntaxError: [
      "Python cannot understand the structure of this line.",
      "Check for a missing colon after if, elif, else, for or while.",
      "Check brackets and quotation marks, and make sure you have not used = where == is needed."
    ],
    IndentationError: [
      "The indentation does not match Python's expected structure.",
      "After a colon, the following line must be indented.",
      "Make sure elif and else line up with the matching if."
    ],
    NameError: [
      "Python cannot find that variable or function name.",
      "Check that the variable was created before it was used.",
      "Compare the spelling and capital letters carefully. Python is case-sensitive."
    ],
    TypeError: [
      "The program used incompatible types together.",
      "Check whether input needs int() or float().",
      "Look for a calculation that mixes text with a number."
    ],
    ValueError: [
      "The function received a value it could not convert or use.",
      "Check what was passed into int() or float().",
      "Make sure the value has the format your program expects."
    ],
    IndexError: [
      "The program tried to use an array position that does not exist.",
      "Remember that the first array index is 0.",
      "Check the array length and the loop range."
    ],
    ZeroDivisionError: [
      "The program tried to divide by zero.",
      "Check the value used after the division symbol.",
      "Use a condition to make sure the divisor is not 0 before dividing."
    ],
    ImportError: [
      "The requested module could not be imported.",
      "Check the module name and whether it is available in this browser version of Python."
    ],
    ModuleNotFoundError: [
      "Python could not find the requested module.",
      "Check the spelling of the module name and whether the app supports it."
    ],
    RuntimeError: [
      parsed.detail.includes("too many steps")
        ? "The program was stopped because it may contain an infinite loop."
        : "The program stopped while it was running.",
      parsed.detail.includes("too many steps")
        ? "Check whether the variable in the while condition is updated inside the loop."
        : "Read the final line of the Python error first, then inspect the indicated code line.",
      "Use Visualise to inspect the variable values immediately before the error."
    ]
  };
  const advice = messages[parsed.errorType] || messages.RuntimeError;
  return `${parsed.errorType}\n\n${lineText}${advice.map(item => `• ${item}`).join("\n")}\n\nPython's final message:\n${parsed.finalLine}`;
}

function showExecutionError(errorText) {
  elements.standardErrorBox.textContent = String(errorText || "Unknown Python error");
  elements.friendlyErrorBox.textContent = friendlyErrorExplanation(errorText);
  elements.errorPanel.classList.remove("hidden");
  applyErrorViewMode();
}

function hideExecutionError() {
  elements.errorPanel.classList.add("hidden");
  elements.standardErrorBox.textContent = "";
  elements.friendlyErrorBox.textContent = "";
}

function setRunningButtons(disabled) {
  elements.runButton.disabled = disabled;
  elements.checkButton.disabled = disabled;
  elements.visualiseButton.disabled = disabled;
}

elements.runButton.addEventListener("click", async () => {
  if (!currentTask) return;
  clearMessage();
  setRunningButtons(true);
  elements.outputBox.textContent = "Running…";
  try {
    const result = await runCode(elements.codeEditor.value, currentTask.sampleInputs || []);
    elements.outputBox.textContent = result.output || "(No output)";
    if (result.error) {
      showExecutionError(result.error);
      elements.feedbackBox.textContent = "Python stopped with an error. Use the two error views below to investigate it.";
      elements.feedbackBox.className = "feedback error";
    } else {
      hideExecutionError();
      elements.feedbackBox.className = "feedback hidden";
    }
  } catch (error) {
    console.error(error);
    elements.outputBox.textContent = "(No output)";
    showExecutionError(String(error));
    elements.feedbackBox.textContent = "Python could not run. Check the internet connection and reload the page.";
    elements.feedbackBox.className = "feedback error";
  } finally {
    setRunningButtons(false);
  }
});

elements.checkButton.addEventListener("click", async () => {
  if (!currentTask) return;
  setRunningButtons(true);
  elements.outputBox.textContent = "Checking…";
  try {
    const tests = await runTaskTests(elements.codeEditor.value, currentTask);
    const execution = tests.firstExecution || { output: "", error: tests.error };
    elements.outputBox.textContent = execution.output || "(No output)";
    let grading;
    if (tests.error) {
      showExecutionError(tests.error);
      grading = { correct: false, feedback: ["Fix the Python error shown below, then check the answer again."] };
    } else {
      hideExecutionError();
      const structural = await gradeCode(elements.codeEditor.value, currentTask, execution.output);
      grading = {
        correct: structural.correct && tests.correct,
        feedback: [...structural.feedback, ...tests.feedback]
      };
    }

    elements.feedbackBox.textContent = grading.correct
      ? "Correct — well done! Your progress has been saved."
      : grading.feedback.join("
");
    elements.feedbackBox.className = `feedback ${grading.correct ? "success" : "error"}`;
    await saveAttempt(grading.correct, tests.error, grading.feedback);
    if (grading.correct) {
      elements.challengeStatus.textContent = "Complete";
      elements.challengeStatus.className = "status-pill complete";
      renderRelatedPractice(currentTask, elements.challengeRelatedPractice);
    } else {
      elements.challengeStatus.textContent = "Needs work";
      elements.challengeStatus.className = "status-pill needs-work";
    }
  } catch (error) {
    console.error("Check/save failed:", error.code, error.message, error);
    const code = error.code ? ` [${error.code}]` : "";
    elements.feedbackBox.textContent = `${error.message || "The answer could not be checked."}${code}`;
    elements.feedbackBox.className = "feedback error";
  } finally {
    setRunningButtons(false);
  }
});

async function saveAttempt(correct, executionError = null, gradingFeedback = []) {
  const progressRef = doc(db, "progress", progressDocumentId(currentTask.id));
  const old = currentProgress.get(currentTask.id) || {};
  const attempts = (old.attempts || 0) + 1;
  const errorType = executionError ? parsePythonError(executionError).errorType : "";
  const errorCounts = { ...(old.errorCounts || {}) };
  if (errorType) errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
  const data = {
    ...baseProgressData(currentTask, old),
    completed: Boolean(old.completed || correct),
    status: Boolean(old.completed || correct) ? "complete" : "needs_work",
    attempts,
    incorrectAttempts: (old.incorrectAttempts || 0) + (correct ? 0 : 1),
    firstAttemptCorrect: (old.attempts || 0) === 0 ? Boolean(correct) : Boolean(old.firstAttemptCorrect),
    lastCode: elements.codeEditor.value,
    lastErrorType: errorType || old.lastErrorType || "",
    errorCounts,
    lastIssue: correct ? "" : (gradingFeedback?.[0] || errorType || "Answer did not pass"),
    lastAttemptAt: serverTimestamp(),
    lastSavedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };
  await setDoc(progressRef, data, { merge: currentProgress.has(currentTask.id) });
  currentProgress.set(currentTask.id, { ...old, ...data });
  codeIsDirty = false;
  clearScheduledAutoSave();
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  setSaveStatus("saved", `Saved at ${time}`);
}

async function saveHintUse() {
  if (!currentTask || !auth.currentUser || currentProfile?.role !== "student") return;
  const progressRef = doc(db, "progress", progressDocumentId(currentTask.id));
  const old = currentProgress.get(currentTask.id) || {};
  const data = {
    ...baseProgressData(currentTask, old),
    status: old.completed ? "complete" : (old.attempts || 0) > 0 ? "needs_work" : "in_progress",
    hintsUsed: (old.hintsUsed || 0) + 1,
    lastCode: elements.codeEditor.value,
    lastSavedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };
  await setDoc(progressRef, data, { merge: currentProgress.has(currentTask.id) });
  currentProgress.set(currentTask.id, { ...old, ...data });
  codeIsDirty = false;
  clearScheduledAutoSave();
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  setSaveStatus("saved", `Saved at ${time}`);
}

async function traceCode(code, inputs = []) {
  const python = await ensurePyodide();
  python.globals.set("student_code", code);
  python.globals.set("input_values_json", JSON.stringify((inputs || []).map(value => String(value))));
  const raw = await python.runPythonAsync(`
import io, sys, traceback, json
_lines = student_code.splitlines()
_steps = []
_counter = {"n": 0}
_buffer = io.StringIO()
_old_stdout, _old_stderr = sys.stdout, sys.stderr
sys.stdout = _buffer
sys.stderr = _buffer
_error = None
_input_values = json.loads(input_values_json)
_input_index = {"value": 0}

def _safe_input(prompt=""):
    if prompt:
        print(str(prompt), end="")
    if _input_index["value"] >= len(_input_values):
        raise EOFError("No more test input values were supplied by the app.")
    value = str(_input_values[_input_index["value"]])
    _input_index["value"] += 1
    print(value)
    return value

def _safe_repr(value):
    try:
        text = repr(value)
        return text if len(text) <= 240 else text[:237] + "..."
    except Exception:
        return "<unprintable>"

def _snapshot(frame):
    result = {}
    for name, value in frame.f_locals.items():
        if not name.startswith("__") and name != "input":
            result[name] = _safe_repr(value)
    return result

def _tracer(frame, event, arg):
    if frame.f_code.co_filename != "<student>":
        return _tracer
    if event == "line":
        _counter["n"] += 1
        if _counter["n"] > 500:
            raise RuntimeError("Stopped: too many steps (possible infinite loop).")
        _steps.append({
            "line": frame.f_lineno,
            "event": "line",
            "variables": _snapshot(frame),
            "output": _buffer.getvalue()
        })
    return _tracer

_env = {"__name__": "__main__", "input": _safe_input}
try:
    _compiled = compile(student_code, "<student>", "exec")
    sys.settrace(_tracer)
    exec(_compiled, _env, _env)
    sys.settrace(None)
    _steps.append({
        "line": 0,
        "event": "done",
        "variables": {name: _safe_repr(value) for name, value in _env.items() if not name.startswith("__") and name != "input"},
        "output": _buffer.getvalue()
    })
except BaseException as exc:
    sys.settrace(None)
    _error = traceback.format_exc()
    _line = getattr(exc, "lineno", None)
    if not _line and _steps:
        _line = _steps[-1].get("line", 0)
    _steps.append({
        "line": int(_line or 0),
        "event": "error",
        "variables": {name: _safe_repr(value) for name, value in _env.items() if not name.startswith("__") and name != "input"},
        "output": _buffer.getvalue()
    })
finally:
    sys.settrace(None)
    sys.stdout, sys.stderr = _old_stdout, _old_stderr
json.dumps({"steps": _steps, "error": _error, "output": _buffer.getvalue()})
  `);
  return JSON.parse(String(raw));
}

function stopTracePlayback() {
  if (tracePlayTimer) {
    clearInterval(tracePlayTimer);
    tracePlayTimer = null;
  }
  if (elements.playTraceButton) elements.playTraceButton.textContent = "Play";
}

function renderTraceStep(index) {
  if (!traceSteps.length || !currentTask) return;
  traceIndex = Math.max(0, Math.min(index, traceSteps.length - 1));
  const step = traceSteps[traceIndex];
  const previous = traceIndex > 0 ? traceSteps[traceIndex - 1] : { variables: {} };
  const lines = elements.codeEditor.value.split("\n");

  elements.visualiserCode.innerHTML = lines.map((line, i) => {
    const lineNumber = i + 1;
    const current = step.line === lineNumber ? " current" : "";
    return `<div class="code-line${current}"><span class="code-line-number">${lineNumber}</span><span class="code-line-text">${escapeHtml(line || " ")}</span></div>`;
  }).join("");

  const variables = step.variables || {};
  const names = Object.keys(variables).sort();
  if (!names.length) {
    elements.visualiserVariables.innerHTML = `<tr><td colspan="2" class="empty-table">No variables have been created yet.</td></tr>`;
  } else {
    elements.visualiserVariables.innerHTML = names.map(name => {
      const changed = previous.variables?.[name] !== variables[name] ? "changed" : "";
      return `<tr class="${changed}"><td>${escapeHtml(name)}</td><td>${escapeHtml(variables[name])}</td></tr>`;
    }).join("");
  }

  elements.visualiserOutput.textContent = step.output || "(no output)";
  const description = step.event === "done"
    ? "Program finished"
    : step.event === "error"
      ? `Program stopped with an error near line ${step.line || "?"}`
      : `About to run line ${step.line}`;
  elements.visualiserStepLabel.textContent = `Step ${traceIndex + 1} of ${traceSteps.length} · ${description}`;

  elements.firstStepButton.disabled = traceIndex === 0;
  elements.previousStepButton.disabled = traceIndex === 0;
  elements.nextStepButton.disabled = traceIndex === traceSteps.length - 1;
  elements.lastStepButton.disabled = traceIndex === traceSteps.length - 1;
}

async function recordVisualiserUse() {
  if (!currentTask || !auth.currentUser || currentProfile?.role !== "student") return;
  const progressRef = doc(db, "progress", progressDocumentId(currentTask.id));
  const old = currentProgress.get(currentTask.id) || {};
  const data = {
    ...baseProgressData(currentTask, old),
    status: old.completed ? "complete" : (old.attempts || 0) > 0 ? "needs_work" : "in_progress",
    visualiserUses: (old.visualiserUses || 0) + 1,
    lastCode: elements.codeEditor.value,
    lastVisualisedAt: serverTimestamp(),
    lastSavedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp()
  };
  await setDoc(progressRef, data, { merge: currentProgress.has(currentTask.id) });
  currentProgress.set(currentTask.id, { ...old, ...data });
  codeIsDirty = false;
  clearScheduledAutoSave();
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  setSaveStatus("saved", `Saved at ${time}`);
}

elements.visualiseButton.addEventListener("click", async () => {
  if (!currentTask) return;
  setRunningButtons(true);
  elements.visualiserPanel.classList.remove("hidden");
  elements.visualiserStepLabel.textContent = "Building the line-by-line replay…";
  elements.visualiserCode.innerHTML = "";
  elements.visualiserVariables.innerHTML = `<tr><td colspan="2" class="empty-table">Loading…</td></tr>`;
  elements.visualiserOutput.textContent = "(no output)";
  try {
    const result = await traceCode(elements.codeEditor.value, currentTask.sampleInputs || []);
    traceSteps = result.steps || [];
    if (!traceSteps.length) {
      traceSteps = [{ line: 0, event: "error", variables: {}, output: result.output || "" }];
    }
    renderTraceStep(0);
    if (result.error) showExecutionError(result.error);
    else hideExecutionError();
    await recordVisualiserUse();
    elements.visualiserPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Visualiser failed:", error);
    showExecutionError(String(error));
    elements.visualiserStepLabel.textContent = "The visualiser could not run this program.";
  } finally {
    setRunningButtons(false);
  }
});

elements.closeVisualiserButton.addEventListener("click", () => {
  stopTracePlayback();
  elements.visualiserPanel.classList.add("hidden");
});

elements.firstStepButton.addEventListener("click", () => {
  stopTracePlayback();
  renderTraceStep(0);
});
elements.previousStepButton.addEventListener("click", () => {
  stopTracePlayback();
  renderTraceStep(traceIndex - 1);
});
elements.nextStepButton.addEventListener("click", () => {
  stopTracePlayback();
  renderTraceStep(traceIndex + 1);
});
elements.lastStepButton.addEventListener("click", () => {
  stopTracePlayback();
  renderTraceStep(traceSteps.length - 1);
});
elements.playTraceButton.addEventListener("click", () => {
  if (!traceSteps.length) return;
  if (tracePlayTimer) {
    stopTracePlayback();
    return;
  }
  if (traceIndex >= traceSteps.length - 1) renderTraceStep(0);
  elements.playTraceButton.textContent = "Pause";
  tracePlayTimer = setInterval(() => {
    if (traceIndex >= traceSteps.length - 1) {
      stopTracePlayback();
      return;
    }
    renderTraceStep(traceIndex + 1);
  }, 900);
});

window.addEventListener("beforeunload", event => {
  if (currentProfile?.role === "student" && currentTask && codeIsDirty) {
    event.preventDefault();
  }
});
