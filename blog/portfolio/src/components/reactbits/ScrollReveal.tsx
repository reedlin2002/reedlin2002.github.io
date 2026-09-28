// From React Bits (https://reactbits.dev) by David Haz, src/ts-default. MIT + Commons Clause — see LICENSE.md.
// Modified for this site:
// - `splitBy="char"` splits per character, since Chinese text has no spaces between words.
// - cleanup kills only this component's tweens/ScrollTriggers (the original killed every ScrollTrigger on the page).
// - renders a <div> instead of an <h2> wrapping a <p>, and exposes the full text to screen readers once.

import React, { useEffect, useRef, useMemo, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: string;
  scrollContainerRef?: RefObject<HTMLElement>;
  splitBy?: 'word' | 'char';
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  splitBy = 'word',
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const parts = splitBy === 'char' ? Array.from(children) : children.split(/(\s+)/);
    return parts.map((part, index) => {
      if (/^\s+$/.test(part)) return part;
      return (
        <span className="word" key={index}>
          {part}
        </span>
      );
    });
  }, [children, splitBy]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const tweens: gsap.core.Tween[] = [];

    tweens.push(
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true
          }
        }
      )
    );

    const wordElements = el.querySelectorAll<HTMLElement>('.word');

    tweens.push(
      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: 'opacity' },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      )
    );

    if (enableBlur) {
      tweens.push(
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true
            }
          }
        )
      );
    }

    return () => {
      tweens.forEach(tween => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>
        <span className="sr-only">{children}</span>
        <span aria-hidden="true">{splitText}</span>
      </p>
    </div>
  );
};

export default ScrollReveal;
