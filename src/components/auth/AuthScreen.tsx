'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import styles from './AuthScreen.module.css';
import { Phone, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { getDynamicAccounts, getDynamicPasswords } from '@/lib/data/mockUsers';



function LoadingScreen({ companyLogo }: { companyLogo: string | null }) {
  return (
    <div className={styles.loadingOverlay}>
      <Image
        src={companyLogo || "/logo.png"}
        alt="FORTIVEX.AI"
        width={100}
        height={100}
        style={{ objectFit: 'contain', width: 'auto', height: 'auto', marginBottom: '20px', animation: 'logoPulse 1.5s ease-in-out infinite' }}
        priority
      />
      <div className={styles.brandName} style={{ marginBottom: '20px' }}>FORTIVEX.AI CRM</div>
      <div className={styles.spinner}></div>
      <div className={styles.loadingText}>Loading...</div>
    </div>
  );
}

export default function AuthScreen({ initialMode = 'login' }: { initialMode?: 'login' | 'signup' }) {
  const { login } = useAuth();
  const { companyLogo } = useSettings();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    const result = await login(loginMobile.trim(), loginPassword);
    if (!result.success) {
      setIsLoading(false);
      setLoginError(result.error || 'Login failed.');
    }
  };

  const handleQuickLogin = (acc: User) => {
    setLoginMobile(acc.mobile);
    setLoginPassword(getDynamicPasswords()[acc.name.toLowerCase()] || getDynamicPasswords()[acc.role]);
    setLoginError('');
  };

  if (isLoading) return <LoadingScreen companyLogo={companyLogo} />;

  return (
    <div className={styles.authContainer}>
      {/* Background Elements */}
      <div className={styles.meshGrid}></div>
      <div className={styles.glowLeft}></div>
      <div className={styles.glowRight}></div>

      {/* Main Card */}
      <div className={styles.authCard}>
        
        {/* LEFT PANEL */}
        <div className={styles.leftPanel}>
          <h2 className={styles.heading}>Login</h2>
          <p className={styles.subHeading}>Enter your credentials to continue</p>

          {loginError && (
            <div className={styles.errorBox}>{loginError}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <input 
                type="tel" 
                placeholder="Mobile Number"
                value={loginMobile} 
                onChange={(e) => setLoginMobile(e.target.value)} 
                required 
              />
              <Phone size={18} className={styles.icon} />
            </div>

            <div className={styles.formGroup}>
              <input 
                type={showLoginPass ? 'text' : 'password'} 
                placeholder="Password"
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                required 
              />
              <span className={`${styles.icon} ${styles.iconClickable}`} onClick={() => setShowLoginPass(!showLoginPass)}>
                {showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <div className={styles.optionsRow}>
              <label className={styles.rememberMe}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                Remember Me
              </label>
              <a href="#" className={styles.forgotLink}>Forgot Password?</a>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Sign In &gt;
            </button>
          </form>

          <div className={styles.signupRow}>
            Don't have an account? <a href="#">Sign Up</a>
          </div>

          <div className={styles.quickLoginCard} style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <div className={styles.quickLoginTitle}>Quick Login — click to fill</div>
            {getDynamicAccounts().map((acc) => (
              <div 
                key={acc.id} 
                className={styles.quickLoginRow}
                onClick={() => handleQuickLogin(acc)}
              >
                <span>{acc.name}</span>
                <span>{acc.mobile}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL (BRANDING) */}
        <div className={styles.diagonalBg}></div>
        
        <div className={styles.rightPanel}>
          <div className={styles.logoImage}>
            <Image
              src={companyLogo || "/logo.png"}
              alt="FORTIVEX.AI"
              width={140}
              height={140}
              style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
              priority
            />
          </div>
          <h1 className={styles.brandTitle}>
            FORTIVEX.<span className={styles.gradientText}>AI CRM</span>
          </h1>
          <h2 className={styles.brandSubtitle}>
            Enterprise Admissions & Sales CRM Platform
          </h2>
          
          <p className={styles.brandDesc}>
            Manage admissions, leads, applications,<br/>
            students, payments, analytics and reports<br/>
            from one intelligent CRM platform.
          </p>

          <ul className={styles.featureList}>
            {['Lead Management', 'Sales Pipeline', 'Smart Follow-ups', 'Live Analytics'].map((f) => (
              <li key={f}>
                <div className={styles.checkIcon}>
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
