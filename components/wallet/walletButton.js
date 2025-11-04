import { useBaseWallet } from './baseWallet';
import { FaWallet } from 'react-icons/fa';
import { useTranslation } from '@/components/useTranslations';

export default function WalletButton({ className = '' }) {
  const { t: text } = useTranslation('common');
  const { address, isConnected, isConnecting, connect, disconnect, formatAddress, balance } = useBaseWallet();

  if (isConnected && address) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className={`gameBtn ${className}`}
          onClick={disconnect}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9em',
          }}
        >
          <FaWallet />
          <span>{formatAddress(address)}</span>
          {balance && (
            <span style={{ opacity: 0.7, fontSize: '0.85em' }}>
              ({parseFloat(balance).toFixed(4)} ETH)
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      className={`gameBtn ${className}`}
      onClick={connect}
      disabled={isConnecting}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <FaWallet />
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  );
}

