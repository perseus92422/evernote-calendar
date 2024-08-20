let htmlToDraft = null;
if (typeof window === 'object') {
    htmlToDraft = require('html-to-draftjs').default;
}

export default htmlToDraft;