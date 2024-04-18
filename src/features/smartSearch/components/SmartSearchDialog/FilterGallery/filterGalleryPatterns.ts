import { FILTER_TYPE } from '../../types';

const PATTERN_TEMPLATES = {
  pattern0: {
    background:
      'radial-gradient($strongColor 49%,#0000 50%) calc(32px/-2) calc(32px/2), repeating-conic-gradient(from 45deg,$paleColor 0 25%,#0000 0 50%) calc(32px/2) calc(32px/2), radial-gradient($strongColor 49%,#0000 50%),radial-gradient($strongColor 49%,#0000 50%) 32px 32px $paleColor',
    backgroundSize: 'calc(2*32px) calc(2*32px)',
  },
  pattern1: {
    background:
      'calc( .9*32px) calc( .9*32px)/calc(2*32px) calc(2*32px) conic-gradient(at 20% 20%,#0000 75%,$paleColor 0), calc(-.1*32px) calc(-.1*32px)/calc(2*32px) calc(2*32px) conic-gradient(at 20% 20%,#0000 75%,$paleColor 0), calc( .7*32px) calc( .7*32px)/calc(2*32px) calc(2*32px) conic-gradient(at 40% 40%,#0000 75%,$strongColor 0), calc(-.3*32px) calc(-.3*32px)/calc(2*32px) calc(2*32px) conic-gradient(at 40% 40%,#0000 75%,$strongColor 0), conic-gradient(from 90deg at 20% 20%,$paleColor 25%,$strongColor 0) 0 0/32px 32px',
    //'radial-gradient(100% 100% at 100% 100%, #0000 46%,$strongColor 47% 53%,#0000 54%) 32px 32px, radial-gradient(100% 100% at 0 0, #0000 46%,$strongColor 47% 53%,#0000 54%) 32px 32px, radial-gradient(100% 100%, #0000 22%, $strongColor 23% 29%, #0000 30% 34%, $strongColor 35% 41%, #0000 42%) $paleColor',
    //backgroundSize: '64px 64px',
  },
  pattern10: {
    background:
      'conic-gradient(at 78% 3%,#0000 75%,$strongColor 0), conic-gradient(at 78% 3%,#0000 75%,$strongColor 0) 32px 32px, conic-gradient(at 78% 3%,#0000 75%,$strongColor 0) calc(2*32px) calc(2*32px), conic-gradient(at 78% 3%,#0000 75%,$strongColor 0) calc(3*32px) calc(3*32px), conic-gradient(at 3% 78%,#0000 75%,$strongColor 0) 0 calc(3*32px), conic-gradient(at 3% 78%,#0000 75%,$strongColor 0) 32px 0, conic-gradient(at 3% 78%,#0000 75%,$strongColor 0) calc(2*32px) 32px, conic-gradient(at 3% 78%,#0000 75%,$strongColor 0) calc(3*32px) calc(2*32px) $paleColor',
    backgroundSize: 'calc(4*32px) calc(4*32px)',
  },
  pattern11: {
    background:
      'radial-gradient($strongColor 34%,#0000 36%) 0 0/32px 32px, linear-gradient( 45deg,#0000 calc(125%/3),$strongColor 0 calc(175%/3),#0000 0) calc(32px/2) calc(32px/2)/calc(2*32px) calc(2*32px), linear-gradient(-45deg,#0000 calc(125%/3),$strongColor 0 calc(175%/3),#0000 0) calc(32px/2) calc(32px/2)/calc(2*32px) calc(2*32px) $paleColor',
  },
  pattern12: {
    background:
      'radial-gradient(32px at calc(100% + calc(32px*.866)) 50%,$strongColor 99%, #0000 101%) 0 calc(-5*32px/2), radial-gradient(32px at calc(100% + calc(32px*.866)) 50%,$strongColor 99%, #0000 101%) calc(-2*calc(32px*.866)) calc(32px/2), radial-gradient(32px at 100% 50%,$paleColor 99%, #0000 101%) 0 calc(-2*32px), radial-gradient(32px,$strongColor 99%, #0000 101%) calc(32px*.866) calc(-5*32px/2), radial-gradient(32px,$paleColor 99%, #0000 101%) calc(32px*.866) calc( 5*32px/2), radial-gradient(32px at 100% 100%,$strongColor 99%, #0000 101%) 0 calc(-1*32px), radial-gradient(32px at 0%   50% ,$strongColor 99%, #0000 101%) 0 calc(-4*32px), radial-gradient(32px,$paleColor 99%, #0000 101%) calc(-1*calc(32px*.866)) calc(-7*32px/2), radial-gradient(32px,$strongColor 99%, #0000 101%) calc(-1*calc(32px*.866)) calc(-5*32px/2), radial-gradient(32px at 100% 50%,$paleColor 99%, #0000 101%) calc(-2*calc(32px*.866)) 32px, radial-gradient(32px,$strongColor 99%, #0000 101%) calc(-1*calc(32px*.866)) calc(32px/ 2), radial-gradient(32px,$paleColor 99%, #0000 101%) calc(-1*calc(32px*.866)) calc(32px/-2), radial-gradient(32px,$strongColor 99%, #0000 101%) 0 calc(-1*32px), radial-gradient(32px,$paleColor 99%, #0000 101%) calc(32px*.866) calc(32px/-2), radial-gradient(32px,$strongColor 99%, #0000 101%) calc(32px*.866) calc(32px/ 2) $paleColor',
    backgroundSize: 'calc(4*calc(32px*.866)) calc(6*32px)',
  },
  pattern2: {
    background:
      'conic-gradient(from 116.56deg at calc(100%/3) 0, #0000 90deg,$paleColor 0), conic-gradient(from -63.44deg at calc(200%/3) 100%, #0000 90deg,$paleColor 0) $strongColor',
    backgroundSize: '32px 32px',
  },
  pattern3: {
    background:
      'conic-gradient(at 10% 50%,#0000 75%,$strongColor 0), conic-gradient(at 10% 50%,#0000 75%,$strongColor 0) calc(1*32px) calc(3*32px), conic-gradient(at 10% 50%,#0000 75%,$strongColor 0) calc(2*32px) calc(1*32px), conic-gradient(at 10% 50%,#0000 75%,$strongColor 0) calc(3*32px) calc(4*32px), conic-gradient(at 10% 50%,#0000 75%,$strongColor 0) calc(4*32px) calc(2*32px), conic-gradient(at 50% 10%,#0000 75%,$strongColor 0) 0 calc(4*32px), conic-gradient(at 50% 10%,#0000 75%,$strongColor 0) calc(1*32px) calc(2*32px), conic-gradient(at 50% 10%,#0000 75%,$strongColor 0) calc(2*32px) 0, conic-gradient(at 50% 10%,#0000 75%,$strongColor 0) calc(3*32px) calc(3*32px), conic-gradient(at 50% 10%,#0000 75%,$strongColor 0) calc(4*32px) calc(1*32px), $paleColor',
    backgroundSize: '160px 160px',
  },
  pattern4: {
    background:
      'radial-gradient(25% 25% at 25% 25%,$strongColor 99%,#0000 101%) 32px 32px/calc(2*32px) calc(2*32px), radial-gradient(25% 25% at 25% 25%,$strongColor 99%,#0000 101%) 0 0/calc(2*32px) calc(2*32px), radial-gradient(50% 50%,$paleColor 98%,#0000) 0 0/32px 32px, repeating-conic-gradient($paleColor 0 25%,$strongColor 0 50%) calc(.5*32px) 0/calc(2*32px) 32px',
  },
  pattern5: {
    background:
      'conic-gradient(at 62.5% 12.5%, $strongColor 25%, #0000 0) calc(32px/-8) calc(32px/2), conic-gradient(at 62.5% 12.5%, $strongColor 25%, #0000 0) calc(-3*32px/8) calc(32px/4), conic-gradient(at 87.5% 62.5%, $strongColor 25%, #0000 0) calc(3*32px/8) calc(32px/4), conic-gradient(at 87.5% 62.5%, $strongColor 25%, #0000 0) calc(32px/-8) 0, conic-gradient(at 25% 12.5%, $strongColor 25%, #0000 0) 0 calc(32px/-4), conic-gradient(at 25% 12.5%, $strongColor 25%, #0000 0) calc(32px/-4) 0, conic-gradient(at 87.5% 87.5%, $strongColor 25%, #0000 0) calc(32px/8) 0 $paleColor',
    backgroundSize: '32px 32px',
  },
  pattern6: {
    background:
      'conic-gradient(from 150deg at 50% 33%,#0000,$strongColor .5deg 60deg,#0000 60.5deg) calc(32px/2) calc(32px/1.4), conic-gradient(from -30deg at 50% 66%,#0000,$strongColor .5deg 60deg,$paleColor 60.5deg)',
    backgroundSize: '32px calc(32px/1.154)',
  },
  pattern7: {
    background:
      'conic-gradient(from 90deg at 2px 2px,#0000 25%,$paleColor 0) -1px -1px, linear-gradient(-45deg,$paleColor 15%,$strongColor 0 28%,#0000 0 72%,$strongColor 0 85%,$paleColor 0),linear-gradient(45deg,$paleColor 15%,$strongColor 0 28%,#0000 0 72%,$strongColor 0 85%,$paleColor 0), conic-gradient(from 90deg at 40% 40%,$paleColor 25%,$strongColor 0) calc(32px/-5) calc(32px/-5)',
    backgroundSize: '32px 32px',
  },
  pattern8: {
    background:
      'conic-gradient(from -45deg at calc(100%/3) calc(100%/3), $paleColor 90deg, #0000 0), conic-gradient(from -135deg at calc(100%/3) calc(2*100%/3), $paleColor 90deg, $strongColor 0 135deg, #0000 0), conic-gradient(from 135deg at calc(2*100%/3) calc(2*100%/3), $paleColor 90deg, $strongColor 0 135deg, #0000 0), conic-gradient(from 45deg at calc(2*100%/3) calc(100%/3), $paleColor 90deg, $strongColor 0 135deg, #0000 0,$paleColor 0 225deg,$strongColor 0)',
    backgroundSize: '64px 64px',
  },
  pattern9: {
    background:
      'conic-gradient($paleColor 25%,#0000 0) 0 0/calc(2*32px) calc(32px/9.5), conic-gradient($paleColor 25%,#0000 0) 0 0/calc(32px/9.5) calc(2*32px), repeating-conic-gradient(#0000 0 25%,$paleColor 0 50%) 32px 0 /calc(2*32px) calc(2*32px), radial-gradient(50% 50%,$strongColor 98%,$paleColor) 0 0/32px 32px',
  },
};

export default function filterGalleryPattern(
  slug: string,
  colors: { pale: string; strong: string }
) {
  let pattern;

  if (slug === FILTER_TYPE.CALL_HISTORY) {
    pattern = PATTERN_TEMPLATES.pattern0;
  } else if (slug === FILTER_TYPE.CAMPAIGN_PARTICIPATION) {
    pattern = PATTERN_TEMPLATES.pattern1;
  } else if (slug === FILTER_TYPE.PERSON_DATA) {
    pattern = PATTERN_TEMPLATES.pattern2;
  } else if (slug === FILTER_TYPE.PERSON_FIELD) {
    pattern = PATTERN_TEMPLATES.pattern3;
  } else if (slug === FILTER_TYPE.PERSON_TAGS) {
    pattern = PATTERN_TEMPLATES.pattern4;
  } else if (slug === FILTER_TYPE.PERSON_VIEW) {
    pattern = PATTERN_TEMPLATES.pattern5;
  } else if (slug === FILTER_TYPE.RANDOM) {
    pattern = PATTERN_TEMPLATES.pattern6;
  } else if (slug === FILTER_TYPE.SUB_QUERY) {
    pattern = PATTERN_TEMPLATES.pattern7;
  } else if (slug === FILTER_TYPE.SURVEY_OPTION) {
    pattern = PATTERN_TEMPLATES.pattern8;
  } else if (slug === FILTER_TYPE.SURVEY_RESPONSE) {
    pattern = PATTERN_TEMPLATES.pattern9;
  } else if (slug === FILTER_TYPE.SURVEY_SUBMISSION) {
    pattern = PATTERN_TEMPLATES.pattern10;
  } else if (slug === FILTER_TYPE.TASK) {
    pattern = PATTERN_TEMPLATES.pattern11;
  } else {
    pattern = PATTERN_TEMPLATES.pattern12;
  }

  pattern.background = pattern.background.replaceAll(
    '$strongColor',
    colors.strong
  );
  pattern.background = pattern.background.replaceAll('$paleColor', colors.pale);
  return pattern;
}
