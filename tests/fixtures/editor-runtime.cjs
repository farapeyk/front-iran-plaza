const React = require('react');
exports.default = function Image(props) { const imageProps = { ...props }; delete imageProps.unoptimized; delete imageProps.fill; return React.createElement('img', imageProps); };
exports.uploadFileAction = async () => ({ success: false, message: 'Uploads are disabled in this isolated fixture' });
