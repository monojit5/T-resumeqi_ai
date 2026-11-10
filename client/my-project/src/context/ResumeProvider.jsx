import { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext";
import { ResumeContext } from "./ResumeContext";
import { SubscriptionContext } from "./SubscriptionContext";
import API_URL from "../config/api";

const resumeContent = (value) => {
  if (!value) return "";
  const content = { ...value };
  ["_id", "userId", "createdAt", "updatedAt", "canDownload", "__v"].forEach((field) => delete content[field]);
  return JSON.stringify(content);
};

function ResumeProvider({ children }) {
  const { auth, handleSessionExpired } = useContext(UserContext);
  const { isPremium, plan } = useContext(SubscriptionContext);
  const [resumes, setResumes] = useState([]);
  const [resume, setResume] = useState(null);
  const [savedResume, setSavedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const token = auth?.token;
  const activeToken = useRef(auth?.token);
  const handleSessionExpiredRef = useRef(handleSessionExpired);

  useEffect(() => {
    handleSessionExpiredRef.current = handleSessionExpired;
  }, [handleSessionExpired]);

  const requestConfig = {
    headers: { Authorization: `Bearer ${auth?.token}` },
  };
  const hasUnsavedChanges = Boolean(
    resume && savedResume && resumeContent(resume) !== resumeContent(savedResume)
  );
  const resumeReady = Boolean(
    resume?.name?.trim() &&
    (resume.summary?.trim() || resume.experience?.length || resume.education?.length || resume.projects?.length || resume.skills?.length)
  );

  const handleError = (error, fallback) => {
    if (error.response?.status === 401) {
      handleSessionExpiredRef.current();
      return;
    }
    toast.error(error.response?.data?.message || fallback);
  };

  const loadResumes = useCallback(async () => {
    if (activeToken.current !== token) {
      activeToken.current = token;
      setResumes([]);
      setResume(null);
      setSavedResume(null);
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(response.data.resumes);
    } catch (error) {
      if (error.response?.status === 401) {
        handleSessionExpiredRef.current();
      } else {
        toast.error(error.response?.data?.message || "Could not load your resumes.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createResume = async () => {
    setBusy(true);
    try {
      const response = await axios.post(`${API_URL}/resume`, {}, requestConfig);
      const created = response.data.resume;
      setResume(created);
      setSavedResume(created);
      setResumes((current) => [created, ...current]);
      toast.success("Your resume draft is ready.");
    } catch (error) {
      handleError(error, "Could not create a resume.");
    } finally {
      setBusy(false);
    }
  };

  const saveResume = async () => {
    if (!resume?._id) return;
    setSaving(true);
    try {
      const resumeId = resume._id;
      const details = { ...resume };
      ["_id", "userId", "createdAt", "updatedAt", "canDownload", "__v"].forEach((field) => delete details[field]);
      const response = await axios.put(`${API_URL}/resume/${resumeId}`, details, requestConfig);
      const saved = response.data.resume;
      setResume(saved);
      setSavedResume(saved);
      setResumes((current) => current.map((item) => item._id === saved._id ? saved : item));
      toast.success("Resume saved.");
    } catch (error) {
      handleError(error, "Could not save your resume.");
    } finally {
      setSaving(false);
    }
  };

  const deleteResume = async (item) => {
    if (!window.confirm(`Delete "${item.title || "this resume"}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_URL}/resume/${item._id}`, requestConfig);
      setResumes((current) => current.filter((resumeItem) => resumeItem._id !== item._id));
      if (resume?._id === item._id) setResume(null);
      if (savedResume?._id === item._id) setSavedResume(null);
      toast.success("Resume deleted.");
    } catch (error) {
      handleError(error, "Could not delete your resume.");
    }
  };

  const downloadResume = async (resumeId) => {
    try {
      const response = await axios.get(`${API_URL}/resume/${resumeId}/download`, {
        ...requestConfig,
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "resume.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      handleError(error, "Could not download your resume.");
    }
  };

  const updateField = (field, value) => setResume((current) => ({ ...current, [field]: value }));
  const updateEntry = (section, index, field, value) => setResume((current) => ({
    ...current,
    [section]: current[section].map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: value } : entry
    ),
  }));
  const addEntry = (section, entry) => setResume((current) => ({
    ...current,
    [section]: [...current[section], entry],
  }));
  const removeEntry = (section, index) => setResume((current) => ({
    ...current,
    [section]: current[section].filter((_, entryIndex) => entryIndex !== index),
  }));

  return (
    <ResumeContext.Provider value={{
      resumes,
      resume,
      setResume,
      savedResume,
      setSavedResume,
      loading,
      saving,
      busy,
      isPremium,
      plan,
      hasUnsavedChanges,
      resumeReady,
      loadResumes,
      createResume,
      saveResume,
      deleteResume,
      downloadResume,
      updateField,
      updateEntry,
      addEntry,
      removeEntry,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export default ResumeProvider;
