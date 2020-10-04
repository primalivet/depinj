const makeUserService = (depsService) => ({
  create: () => {
    // depsService.db.createUser
    // depsService.logger.log
    return "new user";
  },
  get: () => {
    // depsService.logger.log
    return "user";
  },
});

const makeDBService = (depsService) => ({
  connect: () => {
    // depsService.db.connct
    // depsService.logger.log
    return "connection";
  },
  disconnect: () => {
    // depsService.db.disconnect
    // depsService.logger.log
    return null;
  },
});

const makeDepsService = () => {
  const deps = {};

  const register = (key, makeFn) => {
    if (deps[key] !== undefined) {
      throw new Error("Dependency key already registered");
    }

    if (typeof makeFn !== "function") {
      throw new Error("Dependemcy makeFn is not a function");
    }

    deps[key] = makeFn;
  };

  const retrive = (key) => {
    if (deps[key] === undefined) {
      throw new Error("Dependency key not registered");
    }

    return deps[key]();
  };

  return {
    register,
    retrive,
  };
};

const pickBy = (key) => (obj) => obj[key];
const compose = (...fs) => (x) => fs.reduceRight((f, g) => g(f), x);
const callWith = (x) => (f) => f(x);
const merge = (o1) => (o2) => ({ ...o1, ...o2 });
const trace = (label) => (x) => {
  console.log(label + ": " + x);
  return x;
};

const Dependencies = (deps) => ({
  map: (f) => Dependencies(f(deps)),
  show: () => console.log(`Dependencies( ${JSON.stringify(deps)} )`),
});

const addDependency = (depName) => (depFn) => (depsObj) =>
  merge({ [depName]: depFn })(depsObj);

const loadDependency = (depName) => (depsObj) =>
  compose(callWith(), pickBy(depName))(depsObj);

const deps = Dependencies();
deps
  .map(
    addDependency("parser")(() => {
      console.log("loading psrser dependency");
      return "parser";
    })
  )
  .map(loadDependency("parser"));
