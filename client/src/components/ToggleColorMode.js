import { Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ToggleColorMode = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div>
      <Button
        onClick={() => toggleColorMode()}
        pos="absolute"
        top="0"
        right="0"
        m="1rem"
        zIndex={10000}
      >
        {colorMode === "dark" ? (
          <SunIcon color="orange.200" />
        ) : (
          <MoonIcon color="blue.700" />
        )}
      </Button>
      {children}
    </div>
  );
};

export default ToggleColorMode;
