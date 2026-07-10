# ☯ Moneda Yin Yang

Una ruleta de la suerte espiritual basada en el Yin y el Yang. Apuesta tus Puntos de Equilibrio en el lado de la moneda que caerá, acumula rachas, desbloquea logros y recibe mensajes de sabiduría.

## Cómo jugar

1. Selecciona **Yin** (🌙, oscuridad) o **Yang** (☀️, luz).
2. Ajusta tu apuesta usando los controles numéricos (− / + / ½ / Todo).
3. Presiona **Lanzar Moneda**. La moneda girará y mostrará el resultado.
4. Acierta el lado para ganar apuesta ×2 (o más si tienes racha).
5. Cada resultado muestra un mensaje de sabiduría según el lado que cayó.

### Rachas

- 2+ aciertos consecutivos: se muestra el contador de racha.
- 3+ aciertos consecutivos: bonus ×1.1 activo (ganancias multiplicadas).

### Logros

Hay 12 logros ocultos que se desbloquean al alcanzar hitos: primeros lanzamientos, rachas largas, saldos altos, devoción a un lado, remontadas, etc. Se muestran como notificación al conseguirlos y se ven en el panel de estadísticas.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo Vite |
| `npm run build` | Typecheck + build de producción |
| `npm run preview` | Vista previa del build de producción |

## Stack

- **React 19** + **TypeScript 5.7** + **Vite 6**
- **Tailwind CSS v4** (sin `tailwind.config.js`, configuración vía CSS)
- **lucide-react** para iconos
- Persistencia en `localStorage`

## Estructura

```
src/
  main.tsx                       — Punto de entrada
  index.css                      — Animaciones CSS + Tailwind
  components/
    YinYangCoinGame.tsx          — Componente principal (lógica del juego)
    YinYangCoin.tsx              — Moneda animada (SVG Yin Yang)
    WelcomeModal.tsx             — Modal de bienvenida
    BetHistory.tsx               — Historial de los últimos lanzamientos
    WisdomMessage.tsx            — Mensaje de sabiduría
    ParticleEffect.tsx           — Efecto de partículas al ganar
    AnimatedNumber.tsx           — Número animado (balance)
    AchievementPopup.tsx         — Notificación de logro
  utils/
    useLocalStorage.ts           — Hook de persistencia
    achievements.ts              — Definición de logros y estadísticas
    sounds.ts                    — Efectos de sonido
```
