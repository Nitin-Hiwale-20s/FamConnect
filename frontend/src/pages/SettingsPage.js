import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const [profile, setProfile] = useState({
    name: user?.name || '', phone: user?.phone || '',
    farmName: user?.farmName || '', bio: user?.bio || '',
    village: user?.farmLocation?.village || '', district: user?.farmLocation?.district || '',
    taluka: user?.farmLocation?.taluka || '', pincode: user?.farmLocation?.pincode || '',
    vehicleNumber: user?.vehicleNumber || '', assignedArea: user?.assignedArea || ''
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/upload/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ profileImage: res.data.url });
      toast.success('📸 Profile photo update झाली!');
    } catch (err) { toast.error('Photo upload failed'); }
    finally { setUploading(false); }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      const data = { name: profile.name, phone: profile.phone, bio: profile.bio };
      if (user?.role === 'farmer') { data.farmName = profile.farmName; data.farmLocation = { village: profile.village, taluka: profile.taluka, district: profile.district, pincode: profile.pincode }; }
      if (user?.role === 'delivery') { data.vehicleNumber = profile.vehicleNumber; data.assignedArea = profile.assignedArea; }
      const res = await axios.put('/api/auth/profile', data);
      updateUser(res.data.user);
      toast.success('✅ Profile update झाला!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords match नाहीत'); return; }
    if (passwords.newPassword.length < 6) { toast.error('Password minimum 6 characters'); return; }
    setLoading(true);
    try {
      await axios.put('/api/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('🔒 Password change झाला!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'0.75rem', border:`1.5px solid ${c.border}`, borderRadius:'10px', fontSize:'0.95rem', background:c.input, color:c.inputText, boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.85rem', fontWeight:600, color:c.subText, marginBottom:'0.3rem' };

  return (
    <div style={{ minHeight:'100vh', background:c.bg }}>
      <Navbar />
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'2rem 1rem' }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:c.text, marginBottom:'0.3rem' }}>⚙️ {user?.role === 'mr' ? 'सेटिंग्ज' : 'Settings'}</h1>
        <p style={{ color:c.subText, marginBottom:'2rem' }}>तुमची profile आणि account manage करा</p>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem', borderBottom:`1px solid ${c.border}`, paddingBottom:'0' }}>
          {[['profile', '👤 Profile'], ['password', '🔒 Password']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding:'0.75rem 1.5rem', border:'none', background:'transparent', cursor:'pointer', fontWeight: tab===id ? 700 : 500, color: tab===id ? c.green : c.subText, borderBottom: tab===id ? `2px solid ${c.green}` : '2px solid transparent', marginBottom:'-1px', fontSize:'0.9rem' }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            {/* Photo Upload */}
            <div style={{ background:c.cardBg, borderRadius:'16px', padding:'1.5rem', border:`1px solid ${c.border}` }}>
              <h3 style={{ fontWeight:700, color:c.text, marginBottom:'1rem' }}>📸 Profile Photo</h3>
              <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
                <div style={{ width:'90px', height:'90px', borderRadius:'50%', overflow:'hidden', border:`3px solid ${c.green}`, background:c.hover, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {user?.profileImage ? <img src={user.profileImage} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:'2.5rem' }}>👤</span>}
                </div>
                <div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoUpload} />
                  <button onClick={() => fileRef.current.click()} disabled={uploading}
                    style={{ background:c.green, color:'#fff', border:'none', padding:'0.65rem 1.5rem', borderRadius:'10px', cursor:'pointer', fontWeight:700, fontSize:'0.9rem', opacity: uploading ? 0.7 : 1 }}>
                    {uploading ? '⏳ Uploading...' : '📷 Photo बदला'}
                  </button>
                  <p style={{ color:c.subText, fontSize:'0.78rem', marginTop:'0.4rem' }}>JPG, PNG, WEBP · Max 5MB</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div style={{ background:c.cardBg, borderRadius:'16px', padding:'1.5rem', border:`1px solid ${c.border}` }}>
              <h3 style={{ fontWeight:700, color:c.text, marginBottom:'1.2rem' }}>📝 Basic माहिती</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div><label style={lbl}>पूर्ण नाव *</label><input style={inp} value={profile.name} onChange={e => setProfile({...profile, name:e.target.value})} /></div>
                <div><label style={lbl}>Phone *</label><input style={inp} value={profile.phone} onChange={e => setProfile({...profile, phone:e.target.value})} /></div>
              </div>
              <div style={{ marginTop:'0.75rem' }}><label style={lbl}>Bio / About</label><textarea style={{ ...inp, height:'80px', resize:'vertical' }} value={profile.bio} onChange={e => setProfile({...profile, bio:e.target.value})} placeholder="तुमच्याबद्दल सांगा..." /></div>
            </div>

            {/* Farmer specific */}
            {user?.role === 'farmer' && (
              <div style={{ background:c.cardBg, borderRadius:'16px', padding:'1.5rem', border:`1px solid ${c.border}` }}>
                <h3 style={{ fontWeight:700, color:c.text, marginBottom:'1.2rem' }}>🌾 शेताची माहिती</h3>
                <div style={{ marginBottom:'0.75rem' }}><label style={lbl}>शेताचे नाव</label><input style={inp} value={profile.farmName} onChange={e => setProfile({...profile, farmName:e.target.value})} /></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div><label style={lbl}>गाव</label><input style={inp} value={profile.village} onChange={e => setProfile({...profile, village:e.target.value})} /></div>
                  <div><label style={lbl}>तालुका</label><input style={inp} value={profile.taluka} onChange={e => setProfile({...profile, taluka:e.target.value})} /></div>
                  <div><label style={lbl}>जिल्हा</label><input style={inp} value={profile.district} onChange={e => setProfile({...profile, district:e.target.value})} /></div>
                  <div><label style={lbl}>Pincode</label><input style={inp} value={profile.pincode} onChange={e => setProfile({...profile, pincode:e.target.value})} /></div>
                </div>
              </div>
            )}

            <button onClick={handleProfileSave} disabled={loading}
              style={{ background:c.green, color:'#fff', border:'none', padding:'1rem', borderRadius:'12px', fontWeight:700, fontSize:'1rem', cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Saving...' : '✅ Profile Save करा'}
            </button>
          </div>
        )}

        {tab === 'password' && (
          <div style={{ background:c.cardBg, borderRadius:'16px', padding:'1.5rem', border:`1px solid ${c.border}` }}>
            <h3 style={{ fontWeight:700, color:c.text, marginBottom:'1.2rem' }}>🔒 Password बदला</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div><label style={lbl}>Current Password</label><input style={inp} type="password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword:e.target.value})} /></div>
              <div><label style={lbl}>New Password</label><input style={inp} type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword:e.target.value})} /></div>
              <div><label style={lbl}>Confirm New Password</label><input style={inp} type="password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword:e.target.value})} /></div>
              <button onClick={handlePasswordChange} disabled={loading}
                style={{ background:c.green, color:'#fff', border:'none', padding:'1rem', borderRadius:'12px', fontWeight:700, fontSize:'1rem', cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? '⏳ Changing...' : '🔒 Password Change करा'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
