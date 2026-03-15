import React, { useState } from 'react';
import './App.css';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Trophy,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  User,
  Activity,
  FileText,
  Video,
  Folder,
  Plus,
  Trash2,
  Trash,
  Edit2,
  PlusCircle,
  X,
  MapPin,
  CalendarDays
} from 'lucide-react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, addMonths, subMonths, isSameDay, parseISO } from 'date-fns';

// --- MOCK DATA ---
const initialCourses = [
  {
    id: 1,
    title: "SAP ABAP Core Programming",
    organization: "SAP Learning",
    status: "active",
    progress: 75,
    deadline: "2026-04-15",
    tasks: ["Complete Module 4 Assessment", "Review syntax changes in ABAP OO"],
    description: "Core ABAP programming principles. High priority due to tight deadline.",
  },
  {
    id: 2,
    title: "SAP Fiori / UI5 Development",
    organization: "SAP Learning",
    status: "pending",
    progress: 30,
    deadline: "2026-04-20",
    tasks: ["Set up local UI5 runtime", "Complete the initial setup video"],
    description: "Developing modern UX for SAP applications.",
  }
];

const initialInternships = [
  {
    id: 1,
    title: "AI Strategist and Business Intelligence",
    organization: "IBM Skillsbuild",
    status: "active",
    progress: 60,
    deadline: "Weekly",
    tasks: [
      { text: "Attend Weekly Masterclass (Friday 5 PM)", icon: <Video size={16}/> },
      { text: "Submit Google Form for Attendance", icon: <FileText size={16}/> },
      { text: "Complete Learning Course Modules", icon: <BookOpen size={16}/> },
      { text: "Upload Prior Completion Certificate", icon: <AlertCircle size={16}/> }
    ]
  },
  {
    id: 2,
    title: "AI/ML Track Intern",
    organization: "IBM Skillsbuild",
    status: "active",
    progress: 45,
    deadline: "Weekly",
    tasks: [
      { text: "Attend Weekly Masterclass", icon: <Video size={16}/> },
      { text: "Complete Model Building Assignment", icon: <Activity size={16}/> },
      { text: "Submit Attendance Form", icon: <FileText size={16}/> }
    ]
  },
  {
    id: 3,
    title: "Chatbot Development",
    organization: "IBM Skillsbuild",
    status: "pending",
    progress: 10,
    deadline: "Weekly",
    tasks: [
      { text: "Introductory Masterclass", icon: <Video size={16}/> },
      { text: "Explore Watson Assistant docs", icon: <BookOpen size={16}/> }
    ]
  }
];

const initialHackathons = [
  {
    id: 1,
    title: "Robofest 5.0 - Grand Finale",
    organization: "Robofest Org",
    status: "active",
    date: "2026-05-10",
    teamSize: 4,
    description: "Grand Finale round. Need to prepare physical robot prototype and integration code.",
    links: ["Registration Form", "Rulebook PDF", "Submission Portal"]
  },
  {
    id: 2,
    title: "Smart India Hackathon (SIH) 2025",
    organization: "MoE, Govt. of India",
    status: "active",
    date: "2026-06-01",
    teamSize: 6,
    description: "Grand Finale stage. Working on Problem Statement #1042 - Hardware prototype pending.",
    links: ["Nodal Center Form", "Rules & Guidelines"]
  },
  {
    id: 3,
    title: "Odoo Online Hackathon",
    organization: "Odoo",
    status: "pending",
    date: "2026-04-30",
    teamSize: 2,
    description: "Building ERP modules using Python/XML. Participating in the online phase.",
    links: ["Odoo Dev Docs", "Submission Link"]
  }
];

// --- COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('deep-focus');

  // Custom Sections State
  const [customSections, setCustomSections] = useState([
    { id: 'personal-project', label: 'Personal Project', isCustom: true }
  ]);
  const [customTasks, setCustomTasks] = useState({
    'personal-project': [
      { id: 1, text: 'Phase 1: Planning and Wireframing', completed: true },
      { id: 2, text: 'Phase 2: Database Design', completed: false }
    ]
  });

  // Track standard lists in state
  const [courses, setCourses] = useState(initialCourses);
  const [internships, setInternships] = useState(initialInternships);
  const [hackathons, setHackathons] = useState(initialHackathons);

  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, date: '2026-05-10', title: 'Robofest 5.0 Finale', type: 'hackathon' },
    { id: 2, date: '2026-04-15', title: 'ABAP Core Assessment', type: 'course' },
  ]);

  // Modal State
  const [modalConfig, setModalConfig] = useState(null); // null means closed

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const coreNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'SAP Courses', icon: BookOpen },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];
  
  const navItems = [...coreNavItems, ...customSections];

  const openModal = (type, data = null, extraConfig = {}) => {
    setModalConfig({ type, data, ...extraConfig });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const date = formData.get('date');
    const description = formData.get('description');
    const organization = formData.get('organization') || 'Custom';
    
    const newEntry = { 
      id: modalConfig.data?.id || Date.now(), 
      title, date, deadline: date, description, organization, 
      status: 'pending', progress: 0, tasks: [], teamSize: 1, links: []
    };

    if (modalConfig.type === 'ADD_COURSE') setCourses([...courses, newEntry]);
    if (modalConfig.type === 'ADD_INTERNSHIP') setInternships([...internships, newEntry]);
    if (modalConfig.type === 'ADD_HACKATHON') setHackathons([...hackathons, newEntry]);
    if (modalConfig.type === 'ADD_CALENDAR') setCalendarEvents([...calendarEvents, { id: Date.now(), title, date, type: 'general' }]);
    
    if (modalConfig.type === 'ADD_PROJECT') {
      const newId = title.toLowerCase().replace(/\s+/g, '-');
      setCustomSections([...customSections, { id: newId, label: title, isCustom: true, date, description }]);
      setCustomTasks({ ...customTasks, [newId]: [] });
      setActiveTab(newId);
    }
    
    // Simplistic edit override logic
    if (modalConfig.type === 'EDIT_COURSE') setCourses(courses.map(c => c.id === newEntry.id ? { ...c, ...newEntry } : c));
    if (modalConfig.type === 'EDIT_INTERNSHIP') setInternships(internships.map(i => i.id === newEntry.id ? { ...i, ...newEntry } : i));
    if (modalConfig.type === 'EDIT_HACKATHON') setHackathons(hackathons.map(h => h.id === newEntry.id ? { ...h, ...newEntry } : h));
    if (modalConfig.type === 'EDIT_PROJECT') {
      setCustomSections(customSections.map(s => s.id === modalConfig.data.id ? { ...s, label: title, date, description } : s));
    }

    setModalConfig(null);
  };

  const toggleTask = (sectionId, taskId) => {
    setCustomTasks(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const handleDeleteSection = (id) => {
    setCustomSections(prev => prev.filter(s => s.id !== id));
    setCustomTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[id];
      return newTasks;
    });
    setActiveTab('dashboard');
  };

  const renderDashboard = () => (
    <div className="animate-fade-in stagger-1">
      <div className="dashboard-grid">
        <div className="glass stat-card">
          <div className="stat-icon emerald"><BookOpen /></div>
          <div className="stat-info">
            <h4>Active Courses</h4>
            <div className="value">2</div>
          </div>
        </div>
        <div className="glass stat-card">
          <div className="stat-icon purple"><Briefcase /></div>
          <div className="stat-info">
            <h4>IBM Internships</h4>
            <div className="value">3</div>
          </div>
        </div>
        <div className="glass stat-card">
          <div className="stat-icon cyan"><Trophy /></div>
          <div className="stat-info">
            <h4>Hackathon Finals</h4>
            <div className="value">2</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="glass data-card p-6 animate-fade-in stagger-2">
          <h3 className="card-title text-gradient" style={{ marginBottom: '1rem' }}>Immediate Action Required</h3>
          <ul className="task-list">
            <li className="task-item">
               <AlertCircle size={18} className="task-icon" style={{color: 'var(--status-deadline)'}} />
               <span><strong>IBM AI Strategist:</strong> Submit Weekly Attendance Form by Friday</span>
            </li>
            <li className="task-item">
               <Clock size={18} className="task-icon" style={{color: 'var(--status-pending)'}} />
               <span><strong>SAP ABAP:</strong> Module 4 Assessment (Due in 5 days)</span>
            </li>
            <li className="task-item">
               <CheckCircle2 size={18} className="task-icon" style={{color: 'var(--status-active)'}} />
               <span><strong>SIH 2025:</strong> Finalize Nodal Center travel details</span>
            </li>
          </ul>
        </div>
        <div className="glass data-card p-6 animate-fade-in stagger-3">
          <h3 className="card-title text-gradient" style={{ marginBottom: '1rem' }}>Upcoming Events</h3>
          <ul className="task-list">
            <li className="task-item">
               <Video size={18} className="task-icon" />
               <span><strong>IBM AI/ML:</strong> Masterclass - Thursday, 6 PM PST</span>
            </li>
            <li className="task-item">
               <Calendar size={18} className="task-icon" />
               <span><strong>Odoo Hackathon:</strong> Starts on April 30th</span>
            </li>
          </ul>
          <button className="btn btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} onClick={() => setActiveTab('hackathons')}>
            View All Events
          </button>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="animate-fade-in stagger-1">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Current Enrollments</h2>
        <button className="btn btn-primary" onClick={() => openModal('ADD_COURSE', null, { hasDate: true, hasDesc: true, hasOrg: true })}><PlusCircle size={16} /> Add Course</button>
      </div>
      <div className="section-grid">
      {courses.map((course, idx) => (
        <div className={`glass data-card animate-fade-in stagger-${(idx % 4) + 1}`} key={course.id}>
          <div className="card-header">
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <h3 className="card-title">{course.title}</h3>
                <Edit2 size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => openModal('EDIT_COURSE', course, { hasDate: true, hasDesc: true, hasOrg: true })} />
              </div>
              <div className="card-org"><BookOpen size={14}/> {course.organization}</div>
            </div>
            <span className={`badge ${course.status}`}>{course.status}</span>
          </div>
          <div className="card-body">
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem'}}>{course.description}</p>
            
            <h4 style={{fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem'}}>Pending Tasks:</h4>
            <ul className="task-list" style={{ marginTop: 0 }}>
              {course.tasks.map((task, i) => (
                <li className="task-item" key={i}>
                  <ChevronRight size={16} className="task-icon" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>

            <div className="progress-wrapper">
              <div className="progress-meta">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                 <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <span>Deadline: <strong>{course.deadline}</strong></span>
            <button className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Enter Course</button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );

  const renderInternships = () => (
    <div className="animate-fade-in stagger-1">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Active Programs</h2>
        <button className="btn btn-primary" onClick={() => openModal('ADD_INTERNSHIP', null, { hasDate: true, hasDesc: true, hasOrg: true })}><PlusCircle size={16} /> Add Program</button>
      </div>
      <div className="section-grid">
      {internships.map((intern, idx) => (
        <div className={`glass data-card animate-fade-in stagger-${(idx % 4) + 1}`} key={intern.id}>
          <div className="card-header">
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <h3 className="card-title">{intern.title}</h3>
                <Edit2 size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => openModal('EDIT_INTERNSHIP', intern, { hasDate: true, hasDesc: true, hasOrg: true })} />
              </div>
              <div className="card-org"><Briefcase size={14}/> {intern.organization}</div>
            </div>
            <span className={`badge ${intern.status}`}>{intern.status}</span>
          </div>
          <div className="card-body">
            <h4 style={{fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem'}}>Weekly Checklist:</h4>
            <ul className="task-list" style={{ marginTop: 0 }}>
              {intern.tasks.map((task, i) => (
                <li className="task-item" key={i}>
                  <div className="task-icon">{task.icon}</div>
                  <span>{task.text}</span>
                </li>
              ))}
            </ul>
            <div className="progress-wrapper" style={{ marginTop: '1.5rem' }}>
              <div className="progress-meta">
                <span>Program Completion</span>
                <span>{intern.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                 <div className="progress-bar-fill" style={{ width: `${intern.progress}%`, background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}></div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <span>Status: <strong>{intern.deadline} Requirements</strong></span>
            <button className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Submit Forms</button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );

  const renderHackathons = () => (
    <div className="animate-fade-in stagger-1">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Registered Events</h2>
        <button className="btn btn-primary" onClick={() => openModal('ADD_HACKATHON', null, { hasDate: true, hasDesc: true, hasOrg: true })}><PlusCircle size={16} /> Add Hackathon</button>
      </div>
      <div className="section-grid">
      {hackathons.map((hackathon, idx) => (
        <div className={`glass data-card animate-fade-in stagger-${(idx % 4) + 1}`} key={hackathon.id}>
          <div className="card-header">
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <h3 className="card-title">{hackathon.title}</h3>
                <Edit2 size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => openModal('EDIT_HACKATHON', hackathon, { hasDate: true, hasDesc: true, hasOrg: true })} />
              </div>
              <div className="card-org"><Trophy size={14}/> {hackathon.organization}</div>
            </div>
            <span className={`badge ${hackathon.status}`}>{hackathon.status}</span>
          </div>
          <div className="card-body">
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem'}}>{hackathon.description}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--hover-bg)', padding: '0.75rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Event Date</div>
                <div style={{ fontWeight: '600', marginTop: '0.2rem' }}>{hackathon.date}</div>
              </div>
              <div style={{ background: 'var(--hover-bg)', padding: '0.75rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Team Size</div>
                <div style={{ fontWeight: '600', marginTop: '0.2rem' }}>{hackathon.teamSize} Members</div>
              </div>
            </div>

            <h4 style={{fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem'}}>Important Links:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {hackathon.links.map((link, i) => (
                <span key={i} style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  fontSize: '0.8rem', padding: '0.25rem 0.75rem', 
                  background: 'rgba(14, 165, 233, 0.1)', color: '#38bdf8',
                  borderRadius: '999px', cursor: 'pointer', border: '1px solid rgba(14, 165, 233, 0.2)'
                }}>
                  {link} <ExternalLink size={12} />
                </span>
              ))}
            </div>
          </div>
          <div className="card-footer">
             <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Manage Registration & Dashboard</button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="glass data-card animate-fade-in stagger-1" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <h2 className="card-title text-gradient" style={{ fontSize: '1.75rem' }}>{format(currentDate, 'MMMM yyyy')}</h2>
            <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => openModal('ADD_CALENDAR', null, { hasDate: true })}>+ Event</button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setCurrentDate(subMonths(currentDate, 1))}><ChevronRight style={{ transform: 'rotate(180deg)' }} /></button>
            <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setCurrentDate(addMonths(currentDate, 1))}><ChevronRight /></button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '1rem' }}>{day}</div>
          ))}
          {dateRange.map((day, i) => {
            const isTodayDate = isToday(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const dayEvents = calendarEvents.filter(e => isSameDay(parseISO(e.date), day));
            return (
              <div key={i} style={{ 
                minHeight: '100px', 
                padding: '0.5rem', 
                borderRadius: '8px',
                background: isTodayDate ? 'var(--hover-border)' : 'var(--hover-bg)',
                border: isTodayDate ? '1px solid var(--accent-glow)' : '1px solid transparent',
                opacity: isCurrentMonth ? 1 : 0.4
              }}>
                <div style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{format(day, 'd')}</span>
                  {isTodayDate && <span style={{ fontSize: '0.7rem', color: 'var(--accent-glow)' }}>Today</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {dayEvents.map(ev => (
                    <div key={ev.id} style={{
                      fontSize: '0.75rem', padding: '0.25rem 0.4rem', borderRadius: '4px',
                      background: ev.type === 'hackathon' ? 'var(--badge-active-bg)' : 'var(--badge-pending-bg)',
                      color: ev.type === 'hackathon' ? 'var(--status-active)' : 'var(--status-pending)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      • {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCustomSection = (section) => {
    const tasks = customTasks[section.id] || [];
    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    return (
      <div className="glass data-card animate-fade-in stagger-1" style={{ padding: '2rem', minHeight: '600px' }}>
        <div className="card-header" style={{ marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <h2 className="card-title text-gradient" style={{ fontSize: '2rem' }}>{section.label}</h2>
              <Edit2 size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => openModal('EDIT_PROJECT', section, { hasDate: true, hasDesc: true })} />
            </div>
            <div className="card-org" style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              {section.description || "Manage phases and tasks for this specific project."}
              {section.date && <span style={{ marginLeft: '1rem', color: 'var(--status-pending)' }}><Clock size={14} style={{ display: 'inline', marginBottom: '-2px' }}/> Deadline: {section.date}</span>}
            </div>
          </div>
          <button className="btn btn-outline" style={{ color: 'var(--status-deadline)', borderColor: 'var(--status-deadline)' }} onClick={() => handleDeleteSection(section.id)}>
            <Trash2 size={16} /> Delete Project
          </button>
        </div>

        <div className="progress-wrapper" style={{ marginBottom: '2rem' }}>
          <div className="progress-meta">
            <span>Project Completion</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar-bg" style={{ height: '8px' }}>
             <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <ul className="task-list" style={{ marginBottom: '2rem' }}>
          {tasks.map(task => (
            <li key={task.id} className="task-item" style={{ fontSize: '1.05rem', alignItems: 'center', padding: '0.75rem', background: 'var(--hover-bg)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => toggleTask(section.id, task.id)}>
              {task.completed ? 
                 <CheckCircle2 size={20} style={{ color: 'var(--status-active)' }} /> : 
                 <div style={{ width: '20px', height: '20px', border: '2px solid var(--text-muted)', borderRadius: '50%' }}></div>
              }
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1, flexGrow: 1 }}>{task.text}</span>
            </li>
          ))}
          {tasks.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No tasks added yet. Start planning!</div>}
        </ul>

        <form onSubmit={(e) => handleAddTask(section.id, e)} style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
          <input 
            type="text" 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder={`Add a new task to ${section.label}...`}
             style={{ 
               flexGrow: 1, padding: '1rem', borderRadius: '8px', 
               background: 'var(--panel-bg)', color: 'var(--text-main)', 
               border: '1px solid var(--panel-border)', outline: 'none' 
             }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>Add Task</button>
        </form>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar Overlay (Glass) */}
      <aside className="sidebar">
        <div className="logo-section animate-fade-in stagger-1">
          <Activity className="logo-icon" size={28} />
          <span className="text-gradient">Nexus Tracker</span>
        </div>

        <ul className="nav-links animate-fade-in stagger-2">
          {navItems.map((item) => {
            const Icon = item.icon || Folder;
            return (
              <li 
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </li>
            )
          })}
          
          <div style={{ margin: '1rem 0', height: '1px', background: 'var(--panel-border)' }}></div>
          
          <li className="nav-item" onClick={() => openModal('ADD_PROJECT', null, { hasDate: true, hasDesc: true })} style={{ color: 'var(--text-muted)' }}>
            <Plus size={20} />
            <span>Add New Project</span>
          </li>
          
        </ul>

        <div className="user-profile animate-fade-in stagger-4">
          <div className="avatar">NP</div>
          <div className="user-info">
            <span className="name">Nityam Patel</span>
            <span className="role">Pro Developer</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="page-header animate-fade-in">
          <div>
            <h1 className="page-title text-gradient">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="page-subtitle">Manage your immersive workload and conquer deadlines.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                background: 'var(--panel-bg)',
                color: 'var(--text-main)',
                border: '1px solid var(--panel-border)',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                fontFamily: 'Outfit',
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="deep-focus">🌙 Deep Focus Dark</option>
              <option value="clarity-control">☀️ Clarity & Control</option>
              <option value="cyber-agile">⚡ Cyber-Agile</option>
              <option value="cyber-neon">✨ Cyber Neon Hub</option>
            </select>
            
            <button className="btn btn-primary">
              + Quick Add Task
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'internships' && renderInternships()}
        {activeTab === 'hackathons' && renderHackathons()}
        {activeTab === 'calendar' && renderCalendar()}
        {customSections.find(s => s.id === activeTab) && renderCustomSection(customSections.find(s => s.id === activeTab))}
      </main>

      {/* Global Form Modal Overlay */}
      {modalConfig && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 className="card-title text-gradient" style={{ fontSize: '1.5rem' }}>
                {modalConfig.type.startsWith('ADD') ? 'Add New' : 'Edit'} Details
              </h2>
              <button onClick={() => setModalConfig(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Title *</label>
                <input required name="title" defaultValue={modalConfig.data?.title || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--hover-bg)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', outline: 'none' }} />
              </div>
              
              {modalConfig.hasOrg && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Organization / Target</label>
                  <input name="organization" defaultValue={modalConfig.data?.organization || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--hover-bg)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', outline: 'none' }} />
                </div>
              )}
              
              {modalConfig.hasDate && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Date / Deadline (Optional)</label>
                  <input type="date" name="date" defaultValue={modalConfig.data?.date || modalConfig.data?.deadline || ''} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--hover-bg)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', outline: 'none', colorScheme: 'dark' }} />
                </div>
              )}

              {modalConfig.hasDesc && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Short Description (Optional)</label>
                  <textarea name="description" defaultValue={modalConfig.data?.description || ''} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--hover-bg)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', outline: 'none', resize: 'vertical' }} />
                </div>
              )}

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalConfig(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
