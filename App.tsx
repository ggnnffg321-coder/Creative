import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { GameScreen } from './components/GameScreen';
import { FoundersScreen } from './components/FoundersScreen';
import { WalletScreen } from './components/WalletScreen';
import { Screen } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  // Mock shared state for coins to persist between game and wallet for demo
  const [coins, setCoins] = useState(2500); 

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={() => setCurrentScreen('game')} />;
      case 'game':
        return (
          <GameScreen 
            onOpenFounders={() => setCurrentScreen('founders')} 
            onOpenWallet={() => setCurrentScreen('wallet')}
            onLogout={() => setCurrentScreen('login')}
          />
        );
      case 'founders':
        return <FoundersScreen onBack={() => setCurrentScreen('game')} />;
      case 'wallet':
        return <WalletScreen coins={coins} onBack={() => setCurrentScreen('game')} />;
      default:
        return <LoginScreen onLogin={() => setCurrentScreen('game')} />;
    }
  };

  return (
    <div className="w-full h-screen font-cairo text-gray-800 antialiased overflow-hidden select-none">
      {renderScreen()}
    </div>
  );
};

export default App;
