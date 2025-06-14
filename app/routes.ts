import { type RouteConfig, index, route } from "@react-router/dev/routes";

//export default [index("routes/home.tsx")] satisfies RouteConfig;

export default [
  index("routes/home.tsx"), // Path: /
  route("quiz/:mode", "routes/quiz.tsx"), // Path: /quiz
  route("summary", "routes/summary.tsx"), // Path: /summary
] satisfies RouteConfig;
