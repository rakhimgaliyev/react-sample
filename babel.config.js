const plugins = [
  '@babel/proposal-class-properties',
  '@babel/proposal-object-rest-spread',
];

const presets = [
  '@babel/preset-env',
  '@babel/preset-react',
]

if (process.env.NODE_ENV === 'development') {
  plugins.push('react-refresh/babel');
}

module.exports = {
  presets,
  plugins,
};
