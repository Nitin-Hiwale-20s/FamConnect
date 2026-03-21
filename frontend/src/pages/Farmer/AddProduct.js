import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';

const AddProduct = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const c = theme.colors;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const fileRef = useRef();
  const [form, setForm] = useState({
    name: '', nameMarathi: '', category: 'भाजीपाला', description: '',
    price: '', unit: 'kg', availableQty: '', minOrderQty: '0.5', maxOrderQty: '50',
    isOrganic: false, harvestDate: ''
  });

  const categories = ['भाजीपाला','फळे','धान्य','कडधान्य','मसाले','इतर'];
  const units = ['kg','gram','piece','dozen','bundle'];
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const inp = { width:'100%', padding:'0.75rem', border:`1.5px solid ${c.border}`, borderRadius:'10px', fontSize:'0.95rem', background:c.input, color:c.inputText, boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.85rem', fontWeight:600, color:c.subText, marginBottom:'0.3rem' };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) { toast.error('Maximum 5 photos'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const res = await axios.post('/api/upload/product', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImages(prev => [...prev, ...res.data.urls]);
      toast.success(`✅ ${files.length} photo(s) upload झाले!`);
    } catch (err) { toast.error('Photo upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/products', { ...form, price: Number(form.price), availableQty: Number(form.availableQty), minOrderQty: Number(form.minOrderQty), maxOrderQty: Number(form.maxOrderQty), images });
      toast.success('🌱 Product add झाले! Shop मध्ये live आहे!');
      navigate('/farmer/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:c.bg }}>
      <Navbar />
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'2rem 1rem' }}>
        <Link to="/farmer/products" style={{ color:c.green, textDecoration:'none', fontSize:'0.9rem' }}>← Products</Link>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:c.text, margin:'0.5rem 0 2rem' }}>🌱 नवीन Product Add करा</h1>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          {/* Photos */}
          <div style={{ background:c.cardBg, borderRadius:'16px', padding:'1.5rem', border:`1px solid ${c.border}` }}>
            <h3 style={{ fontWeight:700, color:c.text, marginBottom:'1rem' }}>📸 Product Photos (Max 5)</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))', gap:'0.75rem', marginBottom:'1rem' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position:'relative', height:'100px', borderRadius:'10px', overflow:'hidden', border:`1px solid ${c.border}` }}>
                  <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    style={{ position:'absolute', top:'4px', right:'4px', background:'#ef4444', color:'#fff', border:'none', borderRadius:'50%', width:'22px', height:'22px', cursor:'pointer', fontSize:'0.75rem', fontWeight:700 }}>✕</button>
                </div>
              ))}
              {images.length < 5 && (
                <div onClick={() => fileRef.current.click()}
                  style={{ height:'100px', borderRadius:'10px', border:`2px dashed ${c.border}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', color:c.subText, background:c.hover }}>
                  <span style={{ fontSize:'1.5rem' }}>📷</span>
                  <span style={{ fontSize:'0.72rem', marginTop:'0.3rem' }}>{uploading ? 'Uploading...' : 'Photo Add'}</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleImageUpload} />
            {images.length === 0 && <p style={{ color:c.subText, fontSize:'0.82rem' }}>⚠️ Photo असल्यास जास्त orders येतात!</p>}
          </div>

          {/* Basic Info */}
          <div style={{ background:c.cardBg, borderRadius:'16px', padding:'1.5rem', border:`1px solid ${c.border}` }}>
            <h3 style={{ fontWeight:700, color:c.text, marginBottom:'1.2rem' }}>📝 Product माहिती</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div><label style={lbl}>Product नाव (English) *</label><input style={inp} placeholder="e.g. Tomato" value={form.name} onChange={e => f('name', e.target.value)} required /></div>
              <div><label style={lbl}>Product नाव (मराठी)</label><input style={inp} placeholder="उदा. टोमॅटो" value={form.nameMarathi} onChange={e => f('nameMarathi', e.target.value)} /></div>
            </div>
            <div style={{ marginTop:'0.75rem' }}><label style={lbl}>Category *</label><select style={inp} value={form.category} onChange={e => f('category', e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
            <div style={{ marginTop:'0.75rem' }}><label style={lbl}>Description</label><textarea style={{ ...inp, height:'80px', resize:'vertical' }} placeholder="Product बद्दल सांगा..." value={form.description} onChange={e => f('description', e.target.value)} /></div>
            <div style={{ marginTop:'0.75rem', display:'flex', alignItems:'center', gap:'0.75rem', background: form.isOrganic ? '#f0fdf4' : c.hover, padding:'0.75rem', borderRadius:'10px', cursor:'pointer' }} onClick={() => f('isOrganic', !form.isOrganic)}>
              <input type="checkbox" checked={form.isOrganic} onChange={() => {}} style={{ width:'18px', height:'18px', cursor:'pointer' }} />
              <label style={{ cursor:'pointer', fontWeight:600, color: form.isOrganic ? '#16a34a' : c.text }}>🌿 हे Organic आहे (Chemical free)</label>
            </div>
          </div>

          {/* Price & Qty */}
          <div style={{ background:c.cardBg, borderRadius:'16px', padding:'1.5rem', border:`1px solid ${c.border}` }}>
            <h3 style={{ fontWeight:700, color:c.text, marginBottom:'1.2rem' }}>💰 किंमत आणि Quantity</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
              <div><label style={lbl}>किंमत (₹) *</label><input style={inp} type="number" placeholder="40" value={form.price} onChange={e => f('price', e.target.value)} required min="1" /></div>
              <div><label style={lbl}>Unit *</label><select style={inp} value={form.unit} onChange={e => f('unit', e.target.value)}>{units.map(u => <option key={u}>{u}</option>)}</select></div>
              <div><label style={lbl}>Available Qty *</label><input style={inp} type="number" placeholder="100" value={form.availableQty} onChange={e => f('availableQty', e.target.value)} required /></div>
              <div><label style={lbl}>Min Order</label><input style={inp} type="number" step="0.5" value={form.minOrderQty} onChange={e => f('minOrderQty', e.target.value)} /></div>
              <div><label style={lbl}>Max Order</label><input style={inp} type="number" value={form.maxOrderQty} onChange={e => f('maxOrderQty', e.target.value)} /></div>
              <div><label style={lbl}>Harvest Date</label><input style={inp} type="date" value={form.harvestDate} onChange={e => f('harvestDate', e.target.value)} /></div>
            </div>
          </div>

          <div style={{ display:'flex', gap:'1rem' }}>
            <Link to="/farmer/products" style={{ flex:1, background:c.hover, color:c.text, border:`1px solid ${c.border}`, padding:'1rem', borderRadius:'12px', textAlign:'center', fontWeight:600 }}>रद्द करा</Link>
            <button type="submit" disabled={loading} style={{ flex:2, background:'#16a34a', color:'#fff', border:'none', padding:'1rem', borderRadius:'12px', fontWeight:700, fontSize:'1rem', cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Adding...' : '🌱 Product Add करा'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddProduct;
