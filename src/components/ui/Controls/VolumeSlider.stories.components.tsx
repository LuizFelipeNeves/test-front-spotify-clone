import React from 'react';
import { VolumeSlider } from './VolumeSlider';

export const AccessibilityDemoComponent = () => {
  const [volume, setVolume] = React.useState(0.3);
  const [isMuted, setIsMuted] = React.useState(false);

  return (
    <div className="space-y-6 p-6 bg-gray-900 rounded-lg max-w-md">
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">
          Demonstração de Acessibilidade
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Experimente navegar usando apenas o teclado:
        </p>

        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Tab</kbd>
            <span>Navega até o controle</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Enter</kbd>
            <span>Abre o slider de volume</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">←/→</kbd>
            <span>Ajusta o volume</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Esc</kbd>
            <span>Fecha o slider ou cancela</span>
          </div>
        </div>
      </div>

      <VolumeSlider
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={setVolume}
        onToggleMute={() => setIsMuted(!isMuted)}
      />
    </div>
  );
};

export const InteractiveStatesComponent = () => {
  const [volume1, setVolume1] = React.useState(0.3);
  const [volume2, setVolume2] = React.useState(0.7);
  const [volume3, setVolume3] = React.useState(1.0);
  const [isMuted, setIsMuted] = React.useState(false);

  return (
    <div className="space-y-8 p-6 bg-gray-900 rounded-lg max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Diferentes Volumes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Volume Baixo (30%)</p>
            <VolumeSlider
              volume={volume1}
              isMuted={false}
              onVolumeChange={setVolume1}
              onToggleMute={() => {}}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Volume Médio (70%)</p>
            <VolumeSlider
              volume={volume2}
              isMuted={false}
              onVolumeChange={setVolume2}
              onToggleMute={() => {}}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Volume Alto (100%)</p>
            <VolumeSlider
              volume={volume3}
              isMuted={false}
              onVolumeChange={setVolume3}
              onToggleMute={() => {}}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Estado Mudo</h3>
        <div className="flex items-center gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Mudo: {isMuted ? 'Sim' : 'Não'}
            </p>
            <VolumeSlider
              volume={volume1}
              isMuted={isMuted}
              onVolumeChange={setVolume1}
              onToggleMute={() => setIsMuted(!isMuted)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomStylingComponent = () => {
  const [volume, setVolume] = React.useState(0.5);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg max-w-md">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Player Personalizado
        </h3>
        <p className="text-sm text-gray-300 mb-4">
          Slider com cores personalizadas para combinar com o tema
        </p>
      </div>

      <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg">
        <VolumeSlider
          volume={volume}
          isMuted={false}
          onVolumeChange={setVolume}
          onToggleMute={() => {}}
        />
      </div>
    </div>
  );
};

export const KeyboardNavigationComponent = () => {
  const [volume, setVolume] = React.useState(0.4);
  const [isMuted, setIsMuted] = React.useState(false);

  return (
    <div className="space-y-6 p-6 bg-gray-900 rounded-lg max-w-lg">
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">
          Navegação por Teclado
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Teste todas as funcionalidades do teclado:
        </p>

        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Tab</kbd>
            <span>Navega entre elementos</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">
              Enter/Space
            </kbd>
            <span>Ativa controles</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">←/→</kbd>
            <span>Ajusta volume no slider</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">
              Home/End
            </kbd>
            <span>Volume mínimo/máximo</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Esc</kbd>
            <span>Fecha slider</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center p-4 bg-gray-800 rounded">
        <VolumeSlider
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onToggleMute={() => setIsMuted(!isMuted)}
        />
      </div>

      <div className="text-center">
        <div className="text-white font-mono text-sm">
          Estado atual: {Math.round(volume * 100)}%{' '}
          {isMuted ? '(Mudo)' : '(Ativo)'}
        </div>
      </div>
    </div>
  );
};
