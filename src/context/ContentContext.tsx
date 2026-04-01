"use client";
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface ContentContextType {
  content: any;
  updateContent: (section: string, data: any) => Promise<void>;
  updateNestedField: (jsonPath: string, value: any) => Promise<void>;
  saveAllContent: (data: any) => Promise<void>;
  loading: boolean;
}

const ContentContext = React.createContext<ContentContextType>({
  content: {},
  updateContent: async () => {},
  updateNestedField: async () => {},
  saveAllContent: async () => {},
  loading: true,
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  // Helper to set nested property
  const setNestedProperty = (obj: any, path: string, value: any) => {
    const newObj = JSON.parse(JSON.stringify(obj));
    const parts = path.split('.');
    let current = newObj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) current[part] = {};
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
    return newObj;
  };

  useEffect(() => {
    const defaults = {
      site: {
        clubName: "Josephite Math Club",
        logoUrl: ""
      },
      home: {
        heroTitle: "Josephite Math Club",
        heroSubtitle: "Where logic meets imagination.",
        testimonialsTitle: "People About JMC",
        testimonials: [
          { name: "Anthony Prince Costa", role: "Chief Moderator", message: "As Chief Moderator, I take pride in guiding the Math Club, which reflects the spirit of our department. Our mission is to create a community where mathematics is not just about formulas but about critical thinking, curiosity, and teamwork. This club allows students to go beyond textbooks and experience the true beauty of numbers and logic.", imageUrl: "" },
          { name: "Intesher Alam Manam", role: "Club President", message: "As the President of the Math Club, I feel honored to lead such a vibrant community. My vision is to make this club a hub for discovery, learning, and collaboration. Whether it's competitions, workshops, or friendly discussions, we want every member to feel inspired and motivated to see math not as pressure, but as passion.", imageUrl: "" },
          { name: "Shoumik Saha Raj", role: "General Secretary", message: "As General Secretary, my role is to keep our Math Club organized, active, and welcoming for everyone. I work to ensure smooth coordination of events, competitions, and activities so that each member has the chance to participate and grow. Together, we are creating a community where learning mathematics is not only meaningful but also enjoyable.", imageUrl: "" },
          { name: "Monwar Rafat", role: "Deputy President", message: "Serving as Deputy President, I work alongside our president and members to ensure that the Math Club continues to grow with new initiatives. We aim to make mathematics a source of joy, exploration, and innovation for every student, giving them opportunities to learn and lead with confidence.", imageUrl: "" },
          { name: "Arefin Anwar", role: "Vice President", message: "As Vice President, I believe the true strength of our Math Club lies in teamwork and inclusiveness. We are building a community where students not only sharpen their problem-solving skills but also learn to innovate, collaborate, and enjoy mathematics as a lifelong journey of discovery.", imageUrl: "" }
        ]
      },
      about: {
        title: "Our Mathematical Legacy",
        description: "The Josephite Math Club (JMC) is the premier platform for mathematical exploration at St. Joseph's College. Founded on the principles of logic, curiosity, and excellence, we strive to transform the way students perceive and interact with the world of numbers.",
        mission: "To cultivate a deep-seated love for mathematics through rigorous competition, collaborative learning, and innovative problem-solving workshops."
      },
      panel: {
        moderators: [
          { role: "Chief Moderator", name: "Prof. Alan Turing", imageUrl: "https://picsum.photos/200/200?random=20" },
          { role: "Moderator", name: "Dr. Emmy Noether", imageUrl: "https://picsum.photos/200/200?random=21" },
          { role: "Moderator", name: "Prof. Srinivasa Ramanujan", imageUrl: "https://picsum.photos/200/200?random=22" },
        ],
        executive: {
          current: {
            president: [{ role: "President", name: "John Doe", imageUrl: "https://picsum.photos/200/200?random=23" }],
            deputyPresidents: [
              { role: "Deputy President", name: "Jane Smith", imageUrl: "https://picsum.photos/200/200?random=24" },
              { role: "Deputy President", name: "Michael Ross", imageUrl: "https://picsum.photos/200/200?random=25" },
            ],
            generalSecretary: [{ role: "General Secretary", name: "Sarah Connor", imageUrl: "https://picsum.photos/200/200?random=26" }],
            vicePresidents: [
              { role: "Vice President", name: "VP One", imageUrl: "" },
              { role: "Vice President", name: "VP Two", imageUrl: "" },
              { role: "Vice President", name: "VP Three", imageUrl: "" },
              { role: "Vice President", name: "VP Four", imageUrl: "" },
              { role: "Vice President", name: "VP Five", imageUrl: "" },
            ],
            departments: [
              { dept: "Internal Affairs", name: "Head One", imageUrl: "" },
              { dept: "External Affairs", name: "Head Two", imageUrl: "" },
              { dept: "Photography", name: "Head Three", imageUrl: "" },
              { dept: "Events", name: "Head Four", imageUrl: "" },
            ],
            secretaries: {
              asstGeneralSecretary: [
                { name: "Kazi Nafisul Bashar" },
                { name: "Tahmid Muhsin Taqi" },
                { name: "Tawsif Hamid Abir" },
                { name: "Shougoto Saha" },
                { name: "Mahdi Rasif" },
                { name: "Arefin Alam Tanjim" },
                { name: "Tauhidur Rahman" },
                { name: "Zulkarnain Zaman Aarosh" },
                { name: "Sindid Alam" },
                { name: "Muhtadee Tausif Hasan Adib" },
                { name: "MD Jarif Bin Hossain" }
              ],
              jointSecretary: [
                { name: "Swapnil Podder" },
                { name: "Ragib Ash Add" },
                { name: "Md. Nazmus Sakib" },
                { name: "Ajmol Fahim" },
                { name: "Probaho Kul Sanchalon Minhaz" },
                { name: "Shuvashish Saha" },
                { name: "S M Abir" },
                { name: "Tasdid Alam Ratul" },
                { name: "Raiyan Nafir Rhythm" },
                { name: "Sameer Saihan" }
              ],
              organizingSecretary: [
                { name: "Shuvro" },
                { name: "Riyad Miah" },
                { name: "Krrish" },
                { name: "Sadman" },
                { name: "Walid Pathan" },
                { name: "Shirsendu Das" }
              ],
              correspondingSecretary: [
                { name: "Farhan" },
                { name: "Mashnoon" },
                { name: "Oliver" },
                { name: "Shuvro Aninda Bepari" },
                { name: "Saraf Islam Nuhil" },
                { name: "Tahmid" },
                { name: "Al Wasif" }
              ]
            }
          },
          recent: {
            president: [],
            deputyPresidents: [],
            generalSecretary: [],
            vicePresidents: [],
            departments: [],
            secretaries: { asstGeneralSecretary: [], jointSecretary: [], organizingSecretary: [], correspondingSecretary: [] }
          },
          former: {
            president: [],
            deputyPresidents: [],
            generalSecretary: [],
            vicePresidents: [],
            departments: [],
            secretaries: { asstGeneralSecretary: [], jointSecretary: [], organizingSecretary: [], correspondingSecretary: [] }
          }
        }
      },
      gallery: {
        images: []
      },
      notices: {
        title: "NOTICE BOARD",
        subtitle: "ANNOUNCEMENTS",
        description: "Stay updated with the latest announcements, results, and important information from the Josephite Math Club.",
        notices: []
      },
      events: {
        title: "BEYOND NUMBERS",
        subtitle: "UPCOMING EVENTS",
        description: "Join us for a series of challenging competitions, insightful workshops, and engaging seminars designed to push your mathematical boundaries.",
        events: []
      }
    };

    const fetchContent = async () => {
      setLoading(true);
      let localContent = { ...defaults };
      let localUpdatedAt = "1970-01-01T00:00:00Z";
      let remoteContent = {};
      let remoteUpdatedAt = "1970-01-01T00:00:00Z";

      // 1. Try to fetch file-based content (local source)
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const result = await response.json();
          if (result && !result.error) {
            localContent = result.data;
            localUpdatedAt = result.updatedAt;
          }
        } else {
          console.warn("Local content API returned an error:", response.status);
        }
      } catch (err) {
        console.error("Error fetching local content (network error):", err);
      }

      // 2. Try to fetch Supabase content (remote source)
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('site_content')
            .select('data, updated_at')
            .eq('id', 'main')
            .single();
          
          if (data && !error) {
            remoteContent = data.data;
            remoteUpdatedAt = data.updated_at;
          }
        } catch (err) {
          console.error("Error fetching remote content:", err);
        }
      }

      // 3. Compare and Merge: The newer one wins
      const localTime = new Date(localUpdatedAt).getTime();
      const remoteTime = new Date(remoteUpdatedAt).getTime();
      
      // Merge content: newer source takes priority
      const mergedContent = localTime > remoteTime 
        ? { ...remoteContent, ...localContent } 
        : { ...localContent, ...remoteContent };

      setContent(mergedContent);
      setLoading(false);

      // 4. Auto-sync if they are out of sync (only if admin)
      // This ensures manual edits to JSON or DB eventually reach both sources.
      if (isSupabaseConfigured && isAdmin && Math.abs(localTime - remoteTime) > 5000) {
        if (localTime > remoteTime) {
          console.log("Local JSON is newer, syncing to Supabase...");
          await supabase.from('site_content').upsert({ id: 'main', data: localContent });
        } else {
          console.log("Remote Supabase is newer, syncing to local JSON...");
          await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(remoteContent),
          });
        }
      }
    };

    fetchContent();
  }, [isAdmin]);

  // Real-time subscription for Supabase changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('site_content_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content',
          filter: 'id=eq.main',
        },
        (payload) => {
          console.log('Real-time content update received:', payload);
          if (payload.new && (payload.new as any).data) {
            setContent((prev: any) => ({
              ...prev,
              ...(payload.new as any).data
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateContent = async (section: string, data: any) => {
    if (!isAdmin) return;
    const newContent = { ...content, [section]: data };
    
    setContent(newContent);
    
    // Update file-based content
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
    } catch (err) {
      console.error("Error updating file-based content:", err);
    }

    // Update Supabase
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('site_content')
          .upsert({ id: 'main', data: newContent });
        
        if (error) {
          console.error("Supabase Upsert Error (updateContent):", error);
          throw error;
        }
        console.log("Content successfully saved to Supabase.");
      } catch (err: any) {
        console.error("Error updating Supabase content (updateContent):", err);
        const errorMessage = err.message || "Unknown error";
        throw new Error(`Failed to save changes to the database: ${errorMessage}. Please ensure the 'site_content' table exists and RLS policies are configured.`);
      }
    } else {
      console.warn("Supabase is not configured. Changes will only be saved locally (and lost on reload in production).");
    }
  };

  const updateNestedField = async (jsonPath: string, value: any) => {
    if (!isAdmin) return;
    
    const newContent = setNestedProperty(content, jsonPath, value);
    setContent(newContent);

    // Update file-based content
    try {
      await fetch('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonPath, value }),
      });
    } catch (err) {
      console.error("Error updating file-based content:", err);
    }

    // Update Supabase
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('site_content')
          .upsert({ id: 'main', data: newContent });
        
        if (error) throw error;
      } catch (err) {
        console.error("Error updating Supabase content:", err);
      }
    }
  };

  const saveAllContent = async (newContent: any) => {
    if (!isAdmin) return;
    
    setContent(newContent);
    
    // Update file-based content
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
    } catch (err) {
      console.error("Error updating file-based content:", err);
    }

    // Update Supabase
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('site_content')
          .upsert({ id: 'main', data: newContent });
        
        if (error) {
          console.error("Supabase Upsert Error (saveAllContent):", error);
          throw error;
        }
        console.log("Content successfully saved to Supabase.");
      } catch (err: any) {
        console.error("Error updating Supabase content (saveAllContent):", err);
        const errorMessage = err.message || "Unknown error";
        throw new Error(`Failed to save changes to the database: ${errorMessage}. Please ensure the 'site_content' table exists and RLS policies are configured.`);
      }
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, updateNestedField, saveAllContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => React.useContext(ContentContext);
