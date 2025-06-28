export const easing = {
  // Linear
  linear: (t: number): number => t,
  
  // Ease in
  easeInQuad: (t: number): number => t * t,
  easeInCubic: (t: number): number => t * t * t,
  easeInQuart: (t: number): number => t * t * t * t,
  easeInQuint: (t: number): number => t * t * t * t * t,
  
  // Ease out
  easeOutQuad: (t: number): number => t * (2 - t),
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeOutQuart: (t: number): number => 1 - (--t) * t * t * t,
  easeOutQuint: (t: number): number => 1 + (--t) * t * t * t * t,
  
  // Ease in out
  easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInOutCubic: (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInOutQuart: (t: number): number => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInOutQuint: (t: number): number => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  
  // Elastic
  easeInElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  
  // Bounce
  easeInBounce: (t: number): number => 1 - easing.easeOutBounce(1 - t),
  
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  
  easeInOutBounce: (t: number): number => t < 0.5 ? (1 - easing.easeOutBounce(1 - 2 * t)) / 2 : (1 + easing.easeOutBounce(2 * t - 1)) / 2,
  
  // Sine
  easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,
};

export type EasingFunction = (t: number) => number;

export const lerp = (start: number, end: number, t: number, easingFn: EasingFunction = easing.linear): number => {
  return start + (end - start) * easingFn(t);
};

export const lerpVector3 = (
  start: { x: number; y: number; z: number },
  end: { x: number; y: number; z: number },
  t: number,
  easingFn: EasingFunction = easing.linear
): { x: number; y: number; z: number } => {
  const easedT = easingFn(t);
  return {
    x: start.x + (end.x - start.x) * easedT,
    y: start.y + (end.y - start.y) * easedT,
    z: start.z + (end.z - start.z) * easedT,
  };
}; 