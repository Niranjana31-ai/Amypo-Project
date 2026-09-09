import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice';
import authService from '../services/authService';

/* ─────────────── INLINE STYLES ─────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .reg-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    background: #05091a;
  }

  /* ── Background layers ── */
  .reg-bg-base {
    position: fixed; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 80% 60% at 75% -10%, rgba(55,110,255,0.55) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 85% 5%,  rgba(30,60,200,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 100% 80% at 50% 100%, rgba(10,25,80,0.9) 0%, transparent 60%),
      linear-gradient(180deg, #060d22 0%, #080f28 40%, #0a1230 70%, #0d1640 100%);
  }

  /* Aurora streak top-right */
  .reg-aurora {
    position: fixed;
    top: -80px; right: -60px;
    width: 520px; height: 420px;
    background:
      radial-gradient(ellipse 70% 80% at 60% 30%, rgba(60,130,255,0.55) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 80% 10%, rgba(100,160,255,0.4) 0%, transparent 55%);
    border-radius: 50%;
    z-index: 0;
    filter: blur(30px);
    transform: rotate(-15deg);
  }

  /* Mountain silhouette */
  .reg-mountains {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 0;
    pointer-events: none;
  }

  /* ── Left Panel ── */
  .reg-left {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    padding: 36px 44px 32px 52px;
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  .reg-logo-row {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 42px;
  }
  .reg-logo-name {
    font-size: 19px; font-weight: 800;
    letter-spacing: -0.02em; color: #fff;
  }

  .reg-headline {
    font-size: clamp(26px, 2.8vw, 40px);
    font-weight: 800; line-height: 1.15;
    color: #ffffff; letter-spacing: -0.03em;
    margin-bottom: 4px;
  }
  .reg-headline-blue {
    font-size: clamp(26px, 2.8vw, 40px);
    font-weight: 800; line-height: 1.15;
    letter-spacing: -0.03em;
    background: linear-gradient(90deg, #4a90ff, #6cb4ff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 18px;
  }
  .reg-subtitle {
    font-size: 14px; color: rgba(160,175,210,0.85);
    line-height: 1.6; max-width: 320px; margin-bottom: 32px;
  }

  /* Feature icons row */
  .reg-features {
    display: flex; gap: 28px; align-items: flex-start;
    margin-bottom: 36px;
  }
  .reg-feature-item {
    display: flex; flex-direction: column;
    align-items: center; gap: 7px; text-align: center;
    flex: 1; max-width: 80px;
  }
  .reg-feature-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(120,150,255,0.2);
    display: flex; align-items: center; justify-content: center;
    color: rgba(140,170,255,0.9);
  }
  .reg-feature-label {
    font-size: 10.5px; color: rgba(150,170,210,0.8);
    font-weight: 500; line-height: 1.3; white-space: pre-line;
  }

  /* Main illustration area */
  .reg-illustration {
    flex: 1;
    position: relative;
    display: flex;
    align-items: flex-end;
    min-height: 280px;
  }

  /* Dashboard mockup */
  .reg-dash-wrap {
    position: absolute;
    bottom: 10px; left: -8px;
    transform: perspective(900px) rotateY(4deg) rotateX(3deg);
    z-index: 2;
  }
  .reg-dash-card {
    background: rgba(16,24,52,0.95);
    border: 1px solid rgba(80,110,220,0.3);
    border-radius: 14px;
    width: 310px;
    padding: 14px 0 0 0;
    overflow: hidden;
    box-shadow:
      0 20px 50px rgba(0,0,0,0.7),
      0 0 30px rgba(60,100,255,0.2),
      inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .reg-dash-topbar {
    display: flex; align-items: center;
    padding: 0 14px 12px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .reg-dash-dots {
    display: flex; gap: 5px; margin-left: auto;
  }
  .reg-dash-dot { width: 8px; height: 8px; border-radius: 50%; }
  .reg-dash-body {
    display: flex;
  }

  /* sidebar */
  .reg-dash-sidebar {
    width: 82px;
    padding: 10px 0;
    border-right: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }
  .reg-dash-nav-item {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 10px;
    font-size: 9.5px; color: rgba(140,160,200,0.7);
    font-weight: 500; border-radius: 6px; margin: 1px 4px;
    cursor: default;
  }
  .reg-dash-nav-item.active {
    background: rgba(80,110,255,0.25);
    color: #ffffff;
  }
  .reg-dash-nav-dot {
    width: 14px; height: 14px; border-radius: 4px;
    background: rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .reg-dash-nav-dot.active-dot {
    background: linear-gradient(135deg,#4a6aee,#6c8aff);
  }

  /* main content */
  .reg-dash-content {
    flex: 1; padding: 10px 12px;
  }
  .reg-dash-title {
    font-size: 10px; font-weight: 700; color: #fff; margin-bottom: 8px;
  }
  .reg-dash-project-name {
    font-size: 9px; font-weight: 600; color: rgba(160,180,220,0.9); margin-bottom: 4px;
  }
  .reg-dash-progress-track {
    background: rgba(255,255,255,0.08); border-radius: 3px; height: 4px; margin-bottom: 8px; position: relative;
  }
  .reg-dash-progress-fill {
    background: linear-gradient(90deg,#4a6aee,#7a9aff);
    height: 100%; border-radius: 3px; width: 72%;
  }
  .reg-dash-progress-pct {
    position: absolute; right: 0; top: -1px;
    font-size: 7px; color: rgba(160,180,220,0.7);
  }
  .reg-dash-task-row {
    display: flex; align-items: center; gap: 5px; margin-bottom: 4px;
  }
  .reg-dash-task-dot {
    width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  }
  .reg-dash-task-label {
    font-size: 8.5px; color: rgba(150,170,210,0.8);
  }
  .reg-dash-stats {
    display: flex; flex-direction: column; gap: 5px;
    padding: 10px 10px;
    border-left: 1px solid rgba(255,255,255,0.05);
    width: 70px; flex-shrink: 0;
  }
  .reg-dash-stat-box {
    background: rgba(255,255,255,0.04);
    border-radius: 6px; padding: 5px 6px;
  }
  .reg-dash-stat-num {
    font-size: 11px; font-weight: 700; color: #fff; line-height: 1;
  }
  .reg-dash-stat-label {
    font-size: 7.5px; color: rgba(140,160,200,0.7); margin-top: 2px; line-height: 1;
  }
  .reg-dash-badge {
    background: rgba(16,185,129,0.2); border-radius: 5px;
    padding: 3px 6px; font-size: 7.5px;
    color: #34d399; font-weight: 600; text-align: center;
  }

  /* ── Flow diagram ── */
  .reg-flow {
    position: absolute;
    right: 0; top: -10px;
    width: 290px; height: 100%;
    z-index: 3;
  }

  .flow-node {
    display: flex; align-items: center; gap: 8px;
    background: rgba(14,22,55,0.92);
    border: 1px solid rgba(80,120,255,0.28);
    border-radius: 50px;
    padding: 7px 14px;
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 18px rgba(0,0,0,0.5), 0 0 12px rgba(80,120,255,0.15);
    width: fit-content;
    cursor: default;
  }
  .flow-node-icon {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 12px;
  }
  .flow-node-icon.purple {
    background: linear-gradient(135deg, rgba(120,80,220,0.6), rgba(90,60,200,0.4));
    border: 1px solid rgba(140,100,255,0.4);
    color: #c4b5fd;
  }
  .flow-node-icon.blue {
    background: rgba(60,100,255,0.2);
    border: 1px solid rgba(80,130,255,0.3);
    color: #93c5fd;
  }
  .flow-node-text-main {
    font-size: 11px; font-weight: 700; color: #fff; line-height: 1.2;
  }
  .flow-node-text-sub {
    font-size: 8.5px; color: rgba(150,170,210,0.7); line-height: 1.2; margin-top: 1px;
  }

  /* ── Footer bar ── */
  .reg-footer {
    display: flex; align-items: center; gap: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(80,110,200,0.12);
    margin-top: 8px;
  }
  .reg-footer-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 12.5px; color: rgba(150,170,210,0.7); font-weight: 500;
  }
  .reg-footer-sep { color: rgba(80,110,200,0.4); font-size: 11px; }

  /* ── Right Panel ── */
  .reg-right {
    display: flex; align-items: center; justify-content: center;
    padding: 40px 52px 40px 28px;
    position: relative; z-index: 1;
  }

  .reg-card-glow {
    position: absolute; inset: -40px;
    background: radial-gradient(ellipse at center, rgba(70,100,255,0.18) 0%, transparent 65%);
    pointer-events: none;
  }

  .reg-card {
    background: rgba(12,20,50,0.9);
    border: 1px solid rgba(80,120,255,0.32);
    border-radius: 22px;
    padding: 38px 34px;
    width: 390px;
    backdrop-filter: blur(24px);
    position: relative;
    z-index: 1;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 24px 70px rgba(0,0,0,0.7),
      0 0 50px rgba(60,100,255,0.18);
  }
  /* top edge highlight */
  .reg-card::before {
    content: '';
    position: absolute;
    top: 0; left: 12%; right: 12%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(100,150,255,0.7), transparent);
    border-radius: 1px;
  }

  .reg-card-logo-row {
    display: flex; align-items: center; gap: 8px; margin-bottom: 26px;
  }
  .reg-card-logo-name {
    font-size: 15px; font-weight: 700; color: #fff;
  }

  .reg-card-heading {
    font-size: 24px; font-weight: 800; color: #fff;
    letter-spacing: -0.025em; margin-bottom: 6px;
  }
  .reg-card-sub {
    font-size: 13.5px; color: rgba(150,170,210,0.8);
    line-height: 1.5; margin-bottom: 24px;
  }

  /* form fields */
  .rf-group { margin-bottom: 14px; }
  .rf-label {
    display: block; font-size: 12.5px; font-weight: 600;
    color: rgba(170,185,220,0.9); margin-bottom: 6px;
  }
  .rf-input-wrap { position: relative; }
  .rf-icon-left {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    color: rgba(100,130,220,0.7); pointer-events: none;
    display: flex; align-items: center;
  }
  .rf-icon-right {
    position: absolute; right: 13px; top: 50%;
    transform: translateY(-50%);
    color: rgba(100,130,220,0.65);
    background: none; border: none; cursor: pointer; padding: 3px;
    display: flex; align-items: center;
    transition: color 150ms ease;
  }
  .rf-icon-right:hover { color: rgba(130,160,255,1); }
  .rf-input, .rf-select {
    width: 100%;
    padding: 11px 44px 11px 40px;
    background: rgba(8,14,38,0.85);
    border: 1px solid rgba(70,100,200,0.25);
    border-radius: 11px;
    font-size: 13.5px; color: #fff;
    font-family: inherit;
    outline: none;
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }
  .rf-select {
    appearance: none;
    padding-right: 40px;
  }
  .rf-select-icon {
    position: absolute; right: 13px; top: 50%;
    transform: translateY(-50%);
    color: rgba(100,130,220,0.7); pointer-events: none;
    display: flex; align-items: center;
  }
  .rf-select option {
    background: #0d1640;
    color: #fff;
  }
  .rf-input::placeholder { color: rgba(100,120,170,0.6); }
  .rf-input:focus, .rf-select:focus {
    border-color: rgba(90,130,255,0.7);
    box-shadow: 0 0 0 3px rgba(70,110,255,0.2), 0 0 18px rgba(80,130,255,0.12);
    background: rgba(8,14,40,0.98);
  }

  /* Sign up button */
  .rf-btn {
    width: 100%;
    padding: 13px 24px;
    margin-top: 8px;
    background: linear-gradient(135deg, #3d5ddb 0%, #4a6aee 40%, #5a80ff 100%);
    border: 1px solid rgba(120,160,255,0.2);
    border-radius: 50px;
    font-size: 14.5px; font-weight: 700; color: #fff;
    cursor: pointer; font-family: inherit;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    letter-spacing: 0.01em;
    box-shadow:
      0 6px 28px rgba(60,100,255,0.45),
      0 0 0 1px rgba(100,150,255,0.25),
      inset 0 1px 0 rgba(255,255,255,0.15);
    transition: all 220ms cubic-bezier(0.4,0,0.2,1);
  }
  .rf-btn:hover:not(:disabled) {
    transform: translateY(-1.5px);
    box-shadow:
      0 10px 36px rgba(60,100,255,0.6),
      0 0 0 1px rgba(100,150,255,0.4),
      inset 0 1px 0 rgba(255,255,255,0.2);
    background: linear-gradient(135deg, #4565e8 0%, #5575f5 40%, #6a90ff 100%);
  }
  .rf-btn:disabled {
    opacity: 0.6; cursor: not-allowed; transform: none;
  }
  .rf-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,0.25);
    border-top-color: #fff;
    animation: rf-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes rf-spin { to { transform: rotate(360deg); } }

  /* divider */
  .rf-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0 16px;
  }
  .rf-divider-line { flex: 1; height: 1px; background: rgba(70,100,200,0.18); }
  .rf-divider-text {
    font-size: 11.5px; color: rgba(90,115,180,0.7); white-space: nowrap; font-weight: 500;
  }

  /* login link */
  .rf-login {
    text-align: center; font-size: 13px; color: rgba(150,170,210,0.7);
  }
  .rf-login a {
    color: #5a90ff; font-weight: 600; text-decoration: none;
    transition: color 150ms ease;
  }
  .rf-login a:hover { color: #7ab0ff; }

  /* error */
  .rf-error {
    background: rgba(220,50,50,0.1);
    border: 1px solid rgba(220,60,60,0.3);
    border-radius: 10px; padding: 11px 13px;
    margin-bottom: 14px;
    font-size: 12.5px; color: #fca5a5;
    display: flex; align-items: center; gap: 8px;
  }

  @media (max-width: 960px) {
    .reg-left { display: none !important; }
    .reg-right { flex: 1; padding: 24px 20px; }
    .reg-card { width: 100%; max-width: 420px; }
  }
`;

/* ─── Logo SVG ─── */
const Logo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#818cf8"/>
      </linearGradient>
    </defs>
    {/* X-like cross shape */}
    <path d="M4 4 L14 16 L4 28 L10 28 L16 20 L22 28 L28 28 L18 16 L28 4 L22 4 L16 12 L10 4 Z"
      fill="url(#lg-a)" />
  </svg>
);

/* ─── Inline SVGs ─── */
const Ico = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  people: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
  eye: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  folder: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
  ),
  checkSm: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
  users: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  cal: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  bar: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  trend: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  user: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  lock: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  mail: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  briefcase: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  eyeOff: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  eyeOn: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  arrow: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  warn: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

/* ─── Small dashboard component ─── */
const DashboardMockup = () => (
  <div className="reg-dash-card">
    {/* top bar */}
    <div className="reg-dash-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Logo size={14} />
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#fff' }}>SyncUp</span>
      </div>
      <div className="reg-dash-dots">
        <div className="reg-dash-dot" style={{ background: '#ef4444' }} />
        <div className="reg-dash-dot" style={{ background: '#f59e0b' }} />
        <div className="reg-dash-dot" style={{ background: '#10b981' }} />
      </div>
    </div>

    <div className="reg-dash-body">
      {/* sidebar */}
      <div className="reg-dash-sidebar">
        {[
          { icon: Ico.grid, label: 'Dashboard', active: true },
          { icon: Ico.folder, label: 'Projects', active: false },
          { icon: Ico.checkSm, label: 'Tasks', active: false },
          { icon: Ico.users, label: 'Team', active: false },
          { icon: Ico.cal, label: 'Calendar', active: false },
          { icon: Ico.bar, label: 'Reports', active: false },
        ].map(({ icon, label, active }) => (
          <div key={label} className={`reg-dash-nav-item${active ? ' active' : ''}`}>
            <div className={`reg-dash-nav-dot${active ? ' active-dot' : ''}`}
              style={{ color: active ? '#fff' : 'rgba(140,160,200,0.6)', fontSize: 8 }}>
              {icon}
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* main */}
      <div className="reg-dash-content">
        <div className="reg-dash-title">Project Overview</div>
        <div className="reg-dash-project-name">Website Redesign</div>
        <div className="reg-dash-progress-track">
          <div className="reg-dash-progress-fill" />
          <span className="reg-dash-progress-pct">72%</span>
        </div>
        {[
          { label: 'Design', color: '#10b981', done: true },
          { label: 'Development', color: '#4a6aee', done: true },
          { label: 'Testing', color: '#f59e0b', done: false },
          { label: 'Deployment', color: 'rgba(150,170,200,0.4)', done: false },
        ].map(({ label, color, done }) => (
          <div className="reg-dash-task-row" key={label}>
            <div className="reg-dash-task-dot" style={{ background: color }} />
            <span className="reg-dash-task-label">{label}</span>
          </div>
        ))}
      </div>

      {/* right stats */}
      <div className="reg-dash-stats">
        <div className="reg-dash-stat-box">
          <div className="reg-dash-stat-num">12</div>
          <div className="reg-dash-stat-label">Total Tasks</div>
        </div>
        <div className="reg-dash-stat-box">
          <div className="reg-dash-stat-num">4</div>
          <div className="reg-dash-stat-label">Team Members</div>
        </div>
        <div className="reg-dash-badge">On Track</div>
        {/* tiny sparkline */}
        <svg width="52" height="20" viewBox="0 0 52 20" fill="none" style={{ marginTop: 4 }}>
          <polyline points="0,16 8,12 16,14 24,8 32,10 40,5 52,7"
            stroke="#4a6aee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <polyline points="0,16 8,12 16,14 24,8 32,10 40,5 52,7 52,20 0,20"
            fill="rgba(74,106,238,0.12)"/>
        </svg>
      </div>
    </div>
  </div>
);

/* ─── Flow node ─── */
const FlowNode = ({ icon, label, sub, accent = false, style = {} }) => (
  <div className="flow-node" style={style}>
    <div className={`flow-node-icon ${accent ? 'purple' : 'blue'}`}>{icon}</div>
    <div>
      <div className="flow-node-text-main">{label}</div>
      {sub && <div className="flow-node-text-sub">{sub}</div>}
    </div>
  </div>
);

/* ─── Mountain SVG ─── */
const Mountains = () => (
  <svg className="reg-mountains" viewBox="0 0 1440 320" preserveAspectRatio="none"
    style={{ height: 260 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mtn-grd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(15,30,80,0.0)"/>
        <stop offset="100%" stopColor="rgba(8,18,55,0.85)"/>
      </linearGradient>
      <linearGradient id="mtn-glow" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="rgba(40,80,200,0.15)"/>
        <stop offset="100%" stopColor="rgba(10,20,60,0.0)"/>
      </linearGradient>
    </defs>
    {/* Far mountains */}
    <path d="M0,320 L0,220 L80,170 L160,210 L240,140 L320,180 L400,120 L480,160 L560,100
             L640,140 L720,80 L800,130 L880,90 L960,140 L1040,70 L1120,120 L1200,80
             L1280,130 L1360,100 L1440,150 L1440,320 Z"
      fill="rgba(10,18,50,0.6)" />
    {/* Near mountains */}
    <path d="M0,320 L0,260 L120,200 L240,240 L360,170 L480,220 L600,155 L720,200
             L840,140 L960,190 L1080,150 L1200,195 L1320,160 L1440,200 L1440,320 Z"
      fill="rgba(12,22,60,0.8)" />
    {/* Ground with blue glow */}
    <path d="M0,320 L0,295 L1440,295 L1440,320 Z" fill="rgba(20,50,150,0.25)" />
    {/* Overlay gradient for depth */}
    <rect x="0" y="0" width="1440" height="320" fill="url(#mtn-grd)" />
  </svg>
);

/* ═══════════════════════════════ MAIN COMPONENT ═══════════════════════════════ */
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'TEAM_MEMBER' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register(formData);
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="reg-root">
        {/* backgrounds */}
        <div className="reg-bg-base" />
        <div className="reg-aurora" />
        <Mountains />

        {/* ═══ LEFT PANEL ═══ */}
        <div className="reg-left">
          {/* Logo */}
          <div className="reg-logo-row">
            <Logo size={26} />
            <span className="reg-logo-name">SyncUp</span>
          </div>

          {/* Headline */}
          <h1 className="reg-headline">One team. One workspace.</h1>
          <h1 className="reg-headline-blue">One direction.</h1>

          <p className="reg-subtitle">
            Connect projects, tasks, teams and progress<br />in one intelligent workspace.
          </p>

          {/* Features */}
          <div className="reg-features">
            {[
              { icon: Ico.grid,   label: 'Project\nManagement' },
              { icon: Ico.people, label: 'Team\nCollaboration' },
              { icon: Ico.check,  label: 'Task & Progress\nTracking' },
              { icon: Ico.eye,    label: 'Real-time\nVisibility' },
            ].map(({ icon, label }) => (
              <div className="reg-feature-item" key={label}>
                <div className="reg-feature-icon">{icon}</div>
                <span className="reg-feature-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Illustration area */}
          <div className="reg-illustration">
            {/* Dashboard mockup */}
            <div className="reg-dash-wrap">
              <DashboardMockup />
            </div>

            {/* Flow diagram (right side of left panel) */}
            <div className="reg-flow">
              {/* SVG connecting lines */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
                viewBox="0 0 290 290" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="line-grd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(90,130,255,0.5)"/>
                    <stop offset="100%" stopColor="rgba(90,130,255,0.1)"/>
                  </linearGradient>
                </defs>
                <path d="M 145,52 Q 145,72 145,88" stroke="url(#line-grd)" strokeWidth="1.5" fill="none" strokeDasharray="4,3"/>
                <path d="M 125,140 Q 80,155 55,168" stroke="url(#line-grd)" strokeWidth="1.5" fill="none" strokeDasharray="4,3"/>
                <path d="M 165,140 Q 200,155 215,168" stroke="url(#line-grd)" strokeWidth="1.5" fill="none" strokeDasharray="4,3"/>
                <path d="M 70,198 Q 110,220 130,238" stroke="url(#line-grd)" strokeWidth="1.5" fill="none" strokeDasharray="4,3"/>
                <path d="M 215,198 Q 180,220 160,238" stroke="url(#line-grd)" strokeWidth="1.5" fill="none" strokeDasharray="4,3"/>
              </svg>

              {/* Nodes absolutely positioned */}
              <FlowNode
                icon={Ico.folder}
                label="Projects"
                sub="Plan • Organize • Build"
                style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)' }}
              />
              <FlowNode
                icon={Ico.checkSm}
                label="Tasks"
                sub="Track • Manage • Complete"
                accent={true}
                style={{ position: 'absolute', top: 88, left: '50%', transform: 'translateX(-50%)' }}
              />
              <FlowNode
                icon={Ico.users}
                label="Team"
                sub="Collaborate • Communicate"
                style={{ position: 'absolute', top: 166, left: 0 }}
              />
              <FlowNode
                icon={Ico.cal}
                label="Deadlines"
                sub="Stay on Schedule"
                style={{ position: 'absolute', top: 166, right: 0 }}
              />
              <FlowNode
                icon={Ico.trend}
                label="Progress"
                sub="Measure • Improve • Succeed"
                style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="reg-footer">
            {[
              { icon: Ico.cal, label: 'Projects' },
              { icon: Ico.checkSm, label: 'Tasks' },
              { icon: Ico.users, label: 'Teams' },
              { icon: Ico.trend, label: 'Progress' },
            ].map(({ icon, label }, i) => (
              <React.Fragment key={label}>
                <span className="reg-footer-item">
                  <span style={{ color: '#5a80ff' }}>{icon}</span>
                  {label}
                </span>
                {i < 3 && <span className="reg-footer-sep">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="reg-right">
          <div className="reg-card-glow" />
          <div className="reg-card">
            {/* Card logo */}
            <div className="reg-card-logo-row">
              <Logo size={22} />
              <span className="reg-card-logo-name">SyncUp</span>
            </div>

            <h2 className="reg-card-heading">Create Account 🚀</h2>
            <p className="reg-card-sub">Join SyncUp to streamline your team's work.</p>

            {/* Error */}
            {error && (
              <div className="rf-error">
                {Ico.warn}
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="rf-group">
                <label className="rf-label">Username</label>
                <div className="rf-input-wrap">
                  <span className="rf-icon-left">{Ico.user}</span>
                  <input
                    className="rf-input"
                    type="text"
                    name="username"
                    placeholder="Pick a unique username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="rf-group">
                <label className="rf-label">Email Address</label>
                <div className="rf-input-wrap">
                  <span className="rf-icon-left">{Ico.mail}</span>
                  <input
                    className="rf-input"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="rf-group">
                <label className="rf-label">Password</label>
                <div className="rf-input-wrap">
                  <span className="rf-icon-left">{Ico.lock}</span>
                  <input
                    className="rf-input"
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className="rf-icon-right" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                    {showPw ? Ico.eyeOn : Ico.eyeOff}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="rf-group">
                <label className="rf-label">I am a ...</label>
                <div className="rf-input-wrap">
                  <span className="rf-icon-left">{Ico.briefcase}</span>
                  <select
                    className="rf-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="TEAM_MEMBER">Team Member</option>
                    <option value="PROJECT_COORDINATOR">Project Coordinator</option>
                    <option value="STAKEHOLDER">Stakeholder</option>
                  </select>
                  <span className="rf-select-icon">{Ico.chevronDown}</span>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="rf-btn" disabled={loading}>
                {loading
                  ? <><div className="rf-spinner" />Creating Account...</>
                  : <>Create Account {Ico.arrow}</>}
              </button>
            </form>

            {/* Divider */}
            <div className="rf-divider">
              <div className="rf-divider-line" />
              <span className="rf-divider-text">Your work matters</span>
              <div className="rf-divider-line" />
            </div>

            {/* Login Link */}
            <p className="rf-login">
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
