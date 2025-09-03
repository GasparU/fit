// hooks/useDynamicStyles.js
export const useDynamicStyles = (fontSize) => {
  return {
    textStyle: { fontSize: `${fontSize}px` },
    titleStyle: { fontSize: `${fontSize + 2}px` },
    numberStyle: { fontSize: `${fontSize + 4}px` },
    smallTextStyle: { fontSize: `${fontSize - 2}px` },
  };
};
