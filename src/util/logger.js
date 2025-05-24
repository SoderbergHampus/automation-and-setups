
/*
 * Colors
 */
const RESET  = '\x1b[0m';
// const BRIGHT = '\x1b[1m';
// const DIM    = '\x1b[2m';
// const UNDERSCORE = '\x1b[4m';

const FG_GREEN   = '\x1b[32m';
const FG_CYAN    = '\x1b[36m';
const FG_RED     = '\x1b[31m';
// const FG_BLACK   = '\x1b[30m';
const FG_YELLOW  = '\x1b[33m';
// const FG_BLUE    = '\x1b[34m';
// const FG_MAGENTA = '\x1b[35m';
// const FG_WHITE   = '\x1b[37m';

// console.log(FgRed,   'This is red text',   Reset);
// console.log(FgGreen, 'This is green text', Reset);
// console.log(Bright + FgYellow, 'Bright yellow!', Reset);

const DIVIDER_LENGTH = 80;
const SECTION_DIVIDER = '='.repeat(DIVIDER_LENGTH);
const SUBSECTION_DIVIDER = '\n' + '-'.repeat(DIVIDER_LENGTH) + '\n';

const success = (msg) => {
  console.info(FG_GREEN, msg, RESET);
};

const sectionSuccess = (msg) => {
  console.info(
    FG_GREEN,
    '\n',
    SECTION_DIVIDER,
    '\n',
    msg.toUpperCase(),
    '\n',
    SECTION_DIVIDER,
    '\n',
    RESET
  );
};

const info = (msg) => {
  console.info(msg);
};

const log = (msg) => {
  console.log(msg);
};

const section = (msg) => {
  console.info(
    FG_CYAN,
    '\n\n',
    SECTION_DIVIDER,
    '\n',
    msg.toUpperCase(),
    '\n',
    SECTION_DIVIDER,
    '\n',
    RESET
  );
};

const subSection = (msg) => {
  console.info(FG_CYAN, SUBSECTION_DIVIDER, msg, '\n', RESET);
};

const error = (msg) => {
  console.error(FG_RED, msg, RESET);
};

const warn = (msg) => {
  console.error(FG_YELLOW, msg, RESET);
};

export const l = {
  success,
  info,
  log,
  section,
  error,
  subSection,
  warn,
  sectionSuccess
};
