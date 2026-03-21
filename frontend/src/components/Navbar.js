import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme, language, changeLanguage, t, theme, LANGUAGES } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const c = theme.colors;
  const getDashLink = () => ({ farmer:'/farmer', admin:'/admin', delivery:'/delivery', buyer:'/shop' })[user?.role] || '/shop';
  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav style={{ background:c.navBg, borderBottom:`1px solid ${c.border}`, position:'sticky', top:0, zIndex:1000, boxShadow: isDark?'0 1px 0 rgba(255,255,255,0.05)':'0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'0 1.25rem', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.5rem', textDecoration:'none' }}>
            <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#16a34a,#4ade80)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>🌾</div>
            <span style={{ fontSize:'1.15rem', fontWeight:800, color:c.green }}>FarmConnect</span>
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
            <Link to="/shop" style={{ color:c.subText, textDecoration:'none', fontWeight:500, fontSize:'0.9rem' }}>{t.nav.shop}</Link>
            <div style={{ position:'relative' }}>
              <button onClick={() => setLangOpen(!langOpen)} style={{ padding:'0.4rem 0.7rem', borderRadius:'8px', border:`1px solid ${c.border}`, background:c.hover, color:c.text, cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>
                {LANGUAGES[language].flag} {LANGUAGES[language].label} ▾
              </button>
              {langOpen && (
                <div style={{ position:'absolute', top:'110%', right:0, background:c.cardBg, border:`1px solid ${c.border}`, borderRadius:'12px', overflow:'hidden', minWidth:'130px', zIndex:100, boxShadow:'0 8px 30px rgba(0,0,0,0.15)' }}>
                  {Object.values(LANGUAGES).map(lang => (
                    <button key={lang.code} onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                      style={{ display:'block', width:'100%', padding:'0.65rem 1rem', border:'none', background: language===lang.code ? c.green+'15' : 'transparent', color: language===lang.code ? c.green : c.text, cursor:'pointer', textAlign:'left', fontSize:'0.88rem', fontWeight: language===lang.code ? 700 : 500 }}>
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleTheme} style={{ width:'36px', height:'36px', borderRadius:'8px', border:`1px solid ${c.border}`, background:c.hover, cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {isDark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <>
                {user.role === 'buyer' && (
                  <Link to="/cart" style={{ position:'relative', fontSize:'1.3rem', textDecoration:'none' }}>
                    🛒 {cartCount > 0 && <span style={{ position:'absolute', top:'-4px', right:'-4px', background:'#ef4444', color:'#fff', borderRadius:'50%', width:'16px', height:'16px', fontSize:'0.65rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{cartCount}</span>}
                  </Link>
                )}
                <Link to="/settings" style={{ width:'34px', height:'34px', borderRadius:'50%', overflow:'hidden', border:`2px solid ${c.green}`, display:'flex', alignItems:'center', justifyContent:'center', background:c.hover, textDecoration:'none' }}>
                  {user.profileImage ? <img src={user.profileImage} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:'1rem' }}>👤</span>}
                </Link>
                <Link to={getDashLink()} style={{ background:c.green, color:'#fff', padding:'0.45rem 1rem', borderRadius:'8px', textDecoration:'none', fontWeight:700, fontSize:'0.85rem' }}>{t.nav.dashboard}</Link>
                <button onClick={handleLogout} style={{ padding:'0.45rem 0.8rem', borderRadius:'8px', border:`1px solid ${c.border}`, background:'transparent', color:c.subText, cursor:'pointer', fontWeight:600, fontSize:'0.82rem' }}>{t.nav.logout}</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color:c.text, textDecoration:'none', fontWeight:500, fontSize:'0.9rem' }}>{t.nav.login}</Link>
                <Link to="/register" style={{ background:c.green, color:'#fff', padding:'0.45rem 1rem', borderRadius:'8px', textDecoration:'none', fontWeight:700, fontSize:'0.85rem' }}>{t.nav.register}</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
