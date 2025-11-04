import { useEffect, useState } from 'react';
import { useTranslation } from '@/components/useTranslations';

export default function TokenBalance({ session, className = '' }) {
  const { t: text } = useTranslation('common');
  const [tokenBalance, setTokenBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.token?.secret) {
      setLoading(false);
      return;
    }

    const fetchTokenBalance = async () => {
      try {
        // Use dedicated token balance endpoint
        const response = await fetch(window.cConfig.apiUrl + '/api/tokenBalance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ secret: session.token.secret }),
        });

        if (response.ok) {
          const data = await response.json();
          setTokenBalance(data.totalTokens || 0);
        }
      } catch (error) {
        console.error('Error fetching token balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenBalance();
  }, [session?.token?.secret, session?.token?.accountId]);

  if (!session?.token?.secret) {
    return null;
  }

  return (
    <div 
      className={`token-balance ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: '0.95em',
        cursor: 'default',
        transition: 'all 0.3s ease',
        minWidth: '80px', // Prevent layout shift
        justifyContent: 'center',
      }}
      title="Your token balance"
    >
      <span style={{ fontSize: '1.2em' }}>🪙</span>
      <span>{loading ? '...' : (tokenBalance !== null ? tokenBalance.toLocaleString() : '0')}</span>
    </div>
  );
}

