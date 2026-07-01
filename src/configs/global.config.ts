const global = {
  get port() {
    return process.env.PORT || 3000;
  },
};

export default global;
