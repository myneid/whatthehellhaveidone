import type { Transition } from 'motion/react';

/** Gentle spring — hovers, cards, UI lift */
export const springSoft: Transition = {
    type: 'spring',
    stiffness: 360,
    damping: 32,
    mass: 0.9,
};

/** Snappier spring — button press */
export const springTap: Transition = {
    type: 'spring',
    stiffness: 480,
    damping: 36,
    mass: 0.75,
};

/** Staggered page reveals */
export const springReveal: Transition = {
    type: 'spring',
    stiffness: 280,
    damping: 30,
    mass: 1,
};
