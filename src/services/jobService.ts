import { Job, Comment } from "@/types/job";

const API_BASE_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Fetch all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${API_BASE_URL}/alljobs`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to view jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
};

// Fetch applied jobs
export const fetchAppliedJobs = async (): Promise<{
  job: Job;
  applicationDate: string;
}[]> => {
  const response = await fetch(`${API_BASE_URL}/jobs/applied`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to view applied jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch applied jobs');
  }
  
  return response.json();
};

// Apply for a job
export const applyForJob = async (jobId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to apply for jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to apply for job');
  }
  
  // Update local storage for application count
  const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  if (!appliedJobs.includes(jobId)) {
    appliedJobs.push(jobId);
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
  }
};

// Withdraw job application
export const withdrawApplication = async (jobId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/withdraw`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to withdraw application');
  }
  
  if (!response.ok) {
    throw new Error('Failed to withdraw application');
  }
  
  // Update local storage after withdrawal
  const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  const updatedJobs = appliedJobs.filter((id: number) => id !== jobId);
  localStorage.setItem('appliedJobs', JSON.stringify(updatedJobs));
  
  window.dispatchEvent(new Event('applicationCountUpdated'));
};

// Like/unlike a job
export const likeJob = async (jobId: number, like: boolean): Promise<Job> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/like?like=${like}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  
  if (response.status === 401) {
    throw new Error('Please login to like jobs');
  }
  
  if (!response.ok) {
    throw new Error('Failed to update like status');
  }
  
  return response.json();
};

// Add a comment to a job
export const addComment = async (jobId: number, comment: Omit<Comment, 'id'>): Promise<Job> => {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/comment`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(comment)
  });
  
  if (response.status === 401) {
    throw new Error('Please login to add comments');
  }
  
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
  
  return response.json();
};

// Track job application
export const trackJob = async (jobId: number): Promise<void> => {
  try {
    await applyForJob(jobId);
    window.dispatchEvent(new Event('applicationCountUpdated'));
  } catch (error) {
    throw error;
  }
};

// Helper functions for checking job status
export const isJobBookmarked = (jobId: number): boolean => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
  return bookmarks.includes(jobId);
};

export const isJobApplied = (jobId: number): boolean => {
  const applications = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  return applications.includes(jobId);
};

// Bookmark job function
export const bookmarkJob = async (jobId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/bookmark`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    
    if (response.status === 401) {
      throw new Error('Please login to bookmark jobs');
    }
    
    if (!response.ok) {
      throw new Error('Failed to bookmark job');
    }
  } catch (error) {
    // Fallback to localStorage if API fails
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
    const index = bookmarks.indexOf(jobId);
    
    if (index === -1) {
      bookmarks.push(jobId);
    } else {
      bookmarks.splice(index, 1);
    }
    
    localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarks));
  }
};
