import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import { createLinkup } from "../api/linkUpAPI";
import { useSnackbar } from "../contexts/SnackbarContext";
import { Tooltip, IconButton, Button, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useColorMode } from "@chakra-ui/react";
import { customGenderOptions } from "../utils/customGenderOptions";
import { PrimeReactContext } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import LoadingSpinner from "./LoadingSpinner";
import CustomDropdown from "./CustomDropdown";
import CustomMultiSelect from "./CustomMultiSelect";

const WidgetContainer = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "24px",
  maxWidth: "100%", // Default max-width to be 100%
  width: "100%", // Ensure the container spans 100% width on smaller screens
  borderRadius: "28px",
  border: `1px solid ${
    colorMode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
  }`,
  background:
    colorMode === "dark"
      ? "linear-gradient(135deg, rgba(28, 28, 30, 0.7) 0%, rgba(44, 44, 46, 0.5) 100%)"
      : "linear-gradient(135deg, rgba(250, 250, 255, 0.8) 0%, rgba(245, 245, 250, 0.6) 100%)",
  backdropFilter: "blur(24px) saturate(140%)", // Enhanced blur for that glass-like effect
  WebkitBackdropFilter: "blur(24px) saturate(140%)",
  boxShadow:
    colorMode === "dark"
      ? "0 20px 64px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.08)"
      : "0 20px 64px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out", // Smooth transition
  "&:hover": {
    transform: "translateY(-6px)", // Slightly deeper hover effect for the glass feel
    boxShadow:
      colorMode === "dark"
        ? "0 24px 72px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.12)"
        : "0 24px 72px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5)",
  },
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", // Smooth iOS font

  // Liquid glass layers
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      colorMode === "dark"
        ? "radial-gradient(circle at 50% 0%, rgba(0, 229, 255, 0.1) 0%, transparent 50%)"
        : "radial-gradient(circle at 50% 0%, rgba(0, 123, 255, 0.08) 0%, transparent 50%)",
    zIndex: -1,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      colorMode === "dark"
        ? "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%)"
        : "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%)", // Lighter for dark mode
    zIndex: -1,
  },

  // Media Query to set width to 380px for larger screens
  [theme.breakpoints.up("lg")]: {
    maxWidth: "380px", // 380px on large screens
    width: "380px", // Ensure the container is also 380px wide
  },
}));

const Header = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
  fontWeight: "600",
  fontSize: "1.6rem",
  letterSpacing: "-0.5px",
  color:
    colorMode === "dark" ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.95)",
  textShadow:
    colorMode === "dark"
      ? "0 2px 12px rgba(0, 229, 255, 0.25)"
      : "0 2px 8px rgba(0, 123, 255, 0.15)",
  position: "relative",
  zIndex: 2,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "50%",
    height: "3px",
    background:
      colorMode === "dark"
        ? "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6), transparent)"
        : "linear-gradient(90deg, transparent, rgba(0, 123, 255, 0.5), transparent)",
    borderRadius: "3px",
    opacity: 0.8,
  },
}));

const InputField = styled("input")(({ theme, colorMode }) => ({
  width: "100%",
  padding: "10px 18px",
  fontSize: "0.925rem",
  color:
    colorMode === "dark" ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.95)",
  backgroundColor:
    colorMode === "dark" ? "rgba(31, 41, 55, 0.4)" : "rgba(255, 255, 255, 0.7)",
  border: `1px solid ${
    colorMode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
  }`,
  borderRadius: "14px",
  outline: "none",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  backdropFilter: "blur(12px)",
  boxShadow:
    colorMode === "dark"
      ? "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.2)"
      : "inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.05)",
  marginBottom: "8px",
  "&:hover": {
    backgroundColor:
      colorMode === "dark"
        ? "rgba(31, 41, 55, 0.6)"
        : "rgba(255, 255, 255, 0.9)",
    boxShadow:
      colorMode === "dark"
        ? "inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 6px 16px rgba(0, 0, 0, 0.25)"
        : "inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 6px 16px rgba(0, 0, 0, 0.08)",
  },
  "&:focus": {
    backgroundColor:
      colorMode === "dark" ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 1)",
    boxShadow:
      colorMode === "dark"
        ? `0 0 0 2px rgba(0, 229, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.15)`
        : `0 0 0 2px rgba(0, 123, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.6)`,
    borderColor:
      colorMode === "dark"
        ? "rgba(0, 229, 255, 0.4)"
        : "rgba(0, 123, 255, 0.3)",
  },
}));

const DatePickerStyled = styled(DatePicker)(({ theme, colorMode }) => ({
  width: "100%",
  padding: "10px 18px",
  fontSize: "0.9375rem",
  color: colorMode === "dark" ? "#F3F4F6" : "#1F2937",
  backgroundColor:
    colorMode === "dark" ? "rgba(31, 41, 55, 0.5)" : "rgba(255, 255, 255, 0.8)",
  border: `1px solid ${
    colorMode === "dark" ? "rgba(55, 65, 81, 0.5)" : "rgba(209, 213, 219, 0.5)"
  }`,
  borderRadius: "12px",
  outline: "none",
  transition: "all 0.3s ease",
  backdropFilter: "blur(8px)",
  boxShadow:
    colorMode === "dark"
      ? "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, 0.2)"
      : "inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(0, 0, 0, 0.05)",
  marginBottom: "12px",
  "&:hover": {
    boxShadow:
      colorMode === "dark"
        ? "inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)"
        : "inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  "&:focus": {
    boxShadow:
      colorMode === "dark"
        ? `0 0 0 2px rgba(0, 229, 255, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)`
        : `0 0 0 2px rgba(0, 123, 134, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.7)`,
  },
  "&::placeholder": {
    color:
      colorMode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
  },
  cursor: "pointer",
}));

const CreateLinkUpButton = styled(Button)(({ theme }) => ({
  marginTop: "12px",
  minWidth: "120px", // Maintain consistency in width
  background: "linear-gradient(135deg, #00BFAE 0%, #008C73 100%)", // Teal gradient
  color: "#FFFFFF", // Text color remains white
  borderRadius: "8px", // Slightly softer radius for a cleaner look
  padding: "10px 20px", // Balanced padding for a neat look
  fontSize: "0.875rem", // Moderate font size
  fontWeight: 600,
  textTransform: "none",
  border: "none", // Remove border for a more modern, clean look
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  backdropFilter: "blur(8px)", // Slightly lighter blur to keep the focus on the button
  boxShadow:
    "0 4px 12px rgba(0, 191, 174, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)", // Subtle shadow for depth
  "&:hover": {
    background: "linear-gradient(135deg, #008C73 0%, #00BFAE 100%)", // Hover effect with the same teal gradient
    boxShadow:
      "0 6px 16px rgba(0, 191, 174, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)", // More prominent hover shadow
    transform: "translateY(-2px)", // Slight lift effect for a cleaner interaction
  },
  "&:active": {
    transform: "translateY(0)", // Ensure the button feels responsive when clicked
  },
  "&:disabled": {
    background:
      "linear-gradient(135deg, rgba(0, 191, 174, 0.4) 0%, rgba(0, 140, 115, 0.4) 100%)", // Lighter disabled state
    boxShadow: "none",
  },
}));

const ClearFormButton = styled(Button)(({ theme }) => ({
  background: "transparent",
  color: theme.palette.error.main,
  border: `1px solid ${theme.palette.error.main}50`,
  borderRadius: "12px",
  padding: "10px 16px", // Matching padding
  fontSize: "0.875rem", // Matching font size
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  backdropFilter: "blur(12px)",
  marginTop: "12px",
  minWidth: "120px", // Matching minimum width
  "&:hover": {
    background: `${theme.palette.error.main}15`,
    borderColor: theme.palette.error.main,
    boxShadow: `0 4px 12px ${theme.palette.error.main}15`,
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const InfoIconStyled = styled(IconButton)(({ theme, colorMode }) => ({
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  color:
    colorMode === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
  padding: 0,
  backdropFilter: "blur(12px)",
  background:
    colorMode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
  borderRadius: "50%",
  transition: "all 0.3s ease",
  "&:hover": {
    background:
      colorMode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    transform: "translateY(-50%) scale(1.1)",
  },
}));

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "0 8px",
  position: "relative",
  zIndex: 2,
}));

const InputWithIcon = styled("div")({
  position: "relative",
  width: "100%",
});

const ErrorText = styled("p")(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "12px",
  margin: "0 0 8px 8px",
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
}));

const CreateLinkupWidget = ({
  toggleWidget,
  isMobile,
  addLinkup,
  handleScrollToTop,
  formData,
  onFormChange,
}) => {
  const {
    activity: formActivity,
    location: formLocation,
    selectedDate,
    genderPreference,
    paymentOption,
    formErrors,
    isLoading,
  } = formData;
  const loggedUser = useSelector((state) => state.loggedUser?.user || {});
  const { id, name } = loggedUser;
  const { addSnackbar } = useSnackbar();
  const { colorMode } = useColorMode();
  const { changeTheme } = useContext(PrimeReactContext);
  const [currentTheme, setCurrentTheme] = useState("");
  const [isLoadingState, setIsLoading] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const paymentOptions = [
    { label: "No Payment Option", value: null },
    { label: "Split The Bill", value: "split" },
    { label: "I Will Pay", value: "iWillPay" },
    { label: "Please Pay", value: "pleasePay" },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMouseEnter = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * 3;
    const tiltY = ((centerX - x) / centerX) * 3;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setTilt({ x: 0, y: 0 });
    }, 100);
  };

  useEffect(() => {
    const applyTheme = async () => {
      try {
        const themeLink = document.getElementById("theme-link");
        const initialTheme = themeLink.getAttribute("href").includes("dark")
          ? "bootstrap4-dark-blue"
          : "bootstrap4-light-blue";
        setCurrentTheme(initialTheme);

        const newTheme =
          colorMode === "dark"
            ? "bootstrap4-dark-blue"
            : "bootstrap4-light-blue";

        await new Promise((resolve) => setTimeout(resolve, 500));

        await new Promise((resolve) => {
          changeTheme(initialTheme, newTheme, "theme-link", () => {
            setCurrentTheme(newTheme);
            resolve();
          });
        });
      } catch (error) {
        console.error("Error applying theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    applyTheme();
  }, [colorMode, changeTheme]);

  const maxTime = new Date();
  maxTime.setHours(23);
  maxTime.setMinutes(45);

  const minTimeDefault = new Date();
  minTimeDefault.setHours(0);
  minTimeDefault.setMinutes(0);

  const currentDate = new Date();
  const minTime = selectedDate
    ? selectedDate.toDateString() === currentDate.toDateString()
      ? currentDate
      : minTimeDefault
    : currentDate;

  const handleCreateLinkUp = async (e) => {
    e.preventDefault();

    onFormChange("formErrors", {});
    onFormChange("isLoading", true);

    const errors = {};

    if (!formActivity.trim()) {
      errors.activity = "Please enter an activity";
    }

    if (!formLocation.trim()) {
      errors.location = "Please enter a location";
    }

    if (!selectedDate) {
      errors.date = "Please select a date and time";
    }

    if (genderPreference.length === 0) {
      errors.genderPreference = "Please select at least one gender preference.";
    }

    if (Object.keys(errors).length > 0) {
      onFormChange("formErrors", errors);
      return;
    }

    try {
      const response = await createLinkup({
        creator_id: id,
        creator_name: name,
        location: formLocation,
        activity: formActivity,
        date: selectedDate,
        gender_preference: genderPreference,
        payment_option: paymentOption,
      });

      if (response.success) {
        addSnackbar("Linkup created successfully!", "success");

        onFormChange("activity", "");
        onFormChange("location", "");
        onFormChange("selectedDate", null);
        onFormChange("genderPreference", []);
        onFormChange("paymentOption", null);
        onFormChange("isLoading", false);

        addLinkup(response.newLinkup);
        setTimeout(() => handleScrollToTop(), 0);

        if (window.innerWidth <= 600) {
          toggleWidget();
        }
      } else {
        addSnackbar("An error occurred. Please try again.");
      }
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  const handleFocus = (e) => {
    e.target.readOnly = true;
    e.target.blur();
  };

  const handleClearForm = () => {
    onFormChange("activity", "");
    onFormChange("location", "");
    onFormChange("selectedDate", null);
    onFormChange("genderPreference", []);
    onFormChange("paymentOption", null);
    onFormChange("formErrors", {});

    addSnackbar("Form cleared", "info");
  };

  const placeholderStyle = {
    color: "#71767B",
    fontSize: "0.9375rem",
    fontWeight: 400,
  };

  const genderOptions = [
    { key: "men", value: "Men" },
    { key: "women", value: "Women" },
    ...customGenderOptions.map((gender) => ({
      key: gender.toLowerCase(),
      value: gender,
    })),
  ];

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return isLoadingState ? (
    <LoadingSpinner />
  ) : (
    <WidgetContainer
      colorMode={colorMode}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Water reflection effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              600px circle at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(255, 255, 255, ${colorMode === "dark" ? "0.08" : "0.3"}) 0%,
              rgba(255, 255, 255, 0) 70%
            )
          `,
          mask: "linear-gradient(transparent, white 20%, white 80%, transparent)",
          WebkitMask:
            "linear-gradient(transparent, white 20%, white 80%, transparent)",
        }}
      />

      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 16px rgba(255, 255, 255, ${
            colorMode === "dark" ? "0.1" : "0.3"
          })`,
        }}
      />

      <style>
        {` 
          ::placeholder { 
            color: ${
              colorMode === "dark"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.4)"
            }; 
          }`}
      </style>
      <Header colorMode={colorMode}>
        <span>Create Linkup</span>
      </Header>
      <Form onSubmit={handleCreateLinkUp}>
        <InputField
          type="text"
          placeholder="Activity"
          name="activity"
          value={formActivity}
          onChange={(e) => onFormChange("activity", e.target.value)}
          autoComplete="off"
          required
          colorMode={colorMode}
        />
        {formErrors.activity && <ErrorText>{formErrors.activity}</ErrorText>}

        <InputWithIcon>
          <InputField
            type="text"
            placeholder="Location"
            name="location"
            value={formLocation}
            onChange={(e) => onFormChange("location", e.target.value)}
            autoComplete="off"
            required
            colorMode={colorMode}
          />
          {formErrors.location && <ErrorText>{formErrors.location}</ErrorText>}
          <Tooltip
            title={
              <Typography fontSize={16}>
                Please be cautious when specifying a location. Be aware of
                untrusted individuals to prevent uninvited or harmful people
                from attending. We recommend using a vague public location and
                sharing more specific details only when chatting directly with
                trusted individuals.
              </Typography>
            }
            open={tooltipOpen}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            onTouchStart={() => setTooltipOpen(true)}
            onClick={() => setTooltipOpen((prev) => !prev)}
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor:
                    colorMode === "dark" ? "rgb(31,41,55)" : "rgb(243,244,246)",
                  color:
                    colorMode === "dark" ? "rgb(229,231,235)" : "rgb(31,41,55)",
                  border:
                    colorMode === "dark"
                      ? "1px solid rgb(55,65,81)"
                      : "1px solid rgb(209,213,219)",
                  maxWidth: "250px",
                },
              },
              popper: {
                sx: {
                  zIndex: 20000,
                },
              },
            }}
          >
            <InfoIconStyled size="large" colorMode={colorMode}>
              <InfoIcon />
            </InfoIconStyled>
          </Tooltip>
        </InputWithIcon>
        <DatePickerStyled
          selected={selectedDate}
          onChange={(date) => onFormChange("selectedDate", date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={new Date()}
          minTime={minTime}
          maxTime={maxTime}
          placeholderText="Date and Time"
          required
          colorMode={colorMode}
          onFocus={handleFocus}
        />
        {formErrors.date && <ErrorText>{formErrors.date}</ErrorText>}
        <CustomMultiSelect
          colorMode={colorMode}
          options={genderOptions}
          selectedValues={genderPreference}
          setSelectedValues={(values) =>
            onFormChange("genderPreference", values)
          }
          placeholder="Visible to Whom?"
          placeholderStyle={placeholderStyle}
          hasError={!!formErrors.genderPreference}
          isMobile={isMobile}
        />
        {formErrors.genderPreference && (
          <ErrorText>{formErrors.genderPreference}</ErrorText>
        )}
        <CustomDropdown
          options={paymentOptions}
          value={paymentOption}
          onChange={(val) => onFormChange("paymentOption", val)}
          placeholder="Who's Paying?"
          placeholderStyle={placeholderStyle}
          colorMode={colorMode}
        />
        <div className="flex space-x-4">
          <CreateLinkUpButton
            type="submit"
            aria-label="create-linkup"
            size="large"
            className="w-full py-3 px-6 text-xl font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            POST
          </CreateLinkUpButton>
          <ClearFormButton
            type="button"
            onClick={handleClearForm}
            aria-label="clear-form"
            size="large"
            className="w-full py-3 px-6 text-xl font-semibold rounded-lg border border-transparent bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            CLEAR
          </ClearFormButton>
        </div>
      </Form>
    </WidgetContainer>
  );
};

export default CreateLinkupWidget;
