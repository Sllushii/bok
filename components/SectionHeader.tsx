import React from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  sub?: string;
  link?: string;
  href?: string;
  onLink?: () => void;
  icon?: React.ReactNode;
}

export default function SectionHeader({ title, sub, link, href, onLink, icon }: SectionHeaderProps) {
  return (
    <div className="sh-row" style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && (
          <span style={{ color: 'var(--bok-ink)', display: 'flex', transform: 'rotate(-12deg)' }}>
            {icon}
          </span>
        )}
        <div>
          <span className="sh-title">{title}</span>
          {sub && <div className="sh-sub">{sub}</div>}
        </div>
      </div>
      {link && (
        href
          ? <Link href={href} className="sh-link" style={{ textDecoration: 'none' }}>{link}</Link>
          : <span className="sh-link" onClick={onLink}>{link}</span>
      )}
    </div>
  );
}
