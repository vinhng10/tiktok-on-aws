export const sharedClasses = {
  centerInParent: {
    margin: "auto",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fitParent: {
    height: "100%",
    width: "100%",
  },
  card: { height: "100%", padding: 0, border: "none", borderRadius: 0 },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

export const combine = (...classes) => {
  return classes.reduce((acc, obj) => ({ ...acc, ...obj }), {});
};
