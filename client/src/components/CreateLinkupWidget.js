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
  padding: "20px",
  width: "100%",
  maxWidth: "380px",
  borderRadius: "24px",
  border: "none",
  background:
    colorMode === "dark"
      ? "linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(50, 50, 50, 0.4) 100%)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(245, 245, 245, 0.5) 100%)",
  backdropFilter: "blur(12px)",
  boxShadow:
    colorMode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
      : "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.5)",
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      colorMode === "dark"
        ? "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)"
        : "0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.6)",
  },
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
}));

const Header = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
  fontWeight: "600",
  fontSize: "1.5rem",
  letterSpacing: "-0.5px",
  color:
    colorMode === "dark" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
  textShadow:
    colorMode === "dark"
      ? "0 2px 10px rgba(0, 229, 255, 0.3)"
      : "0 2px 6px rgba(0, 123, 134, 0.2)",
  position: "relative",
  zIndex: 2,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "40%",
    height: "3px",
    background:
      colorMode === "dark"
        ? "linear-gradient(90deg, rgba(0, 229, 255, 0), rgba(0, 229, 255, 0.7), rgba(0, 229, 255, 0))"
        : "linear-gradient(90deg, rgba(0, 123, 134, 0), rgba(0, 123, 134, 0.7), rgba(0, 123, 134, 0))",
    borderRadius: "3px",
  },
}));

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "0 4px",
  position: "relative",
  zIndex: 2,
}));

const InputField = styled("input")(({ theme, colorMode }) => ({
  width: "100%",
  padding: "12px 16px",
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
  marginBottom: "4px",
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
}));

const DatePickerStyled = styled(DatePicker)(({ theme, colorMode }) => ({
  width: "100%",
  padding: "12px 16px",
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
  background: "linear-gradient(135deg, #007BFF 0%, #00A5FF 100%)",
  color: "#FFFFFF",
  borderRadius: "12px",
  padding: "14px 16px",
  fontSize: "0.9375rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s ease",
  border: "none",
  backdropFilter: "blur(8px)",
  boxShadow:
    "0 4px 20px rgba(0, 123, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #0069D9 0%, #0088FF 100%)",
    boxShadow:
      "0 6px 24px rgba(0, 123, 255, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
  },
  "&:disabled": {
    background: "linear-gradient(135deg, #007BFF80 0%, #00A5FF80 100%)",
    boxShadow: "none",
  },
}));

const ClearFormButton = styled(Button)(({ theme }) => ({
  background: "transparent",
  color: theme.palette.error.main,
  border: `1px solid ${theme.palette.error.main}80`,
  borderRadius: "12px",
  padding: "14px 16px",
  fontSize: "0.9375rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s ease",
  backdropFilter: "blur(8px)",
  marginTop: "12px",
  "&:hover": {
    background: `${theme.palette.error.main}20`,
    borderColor: theme.palette.error.main,
    boxShadow: `0 4px 20px ${theme.palette.error.main}20`,
  },
}));

const InputWithIcon = styled("div")({
  position: "relative",
  width: "100%",
});

const InfoIconStyled = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: "8px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "rgba(255, 255, 255, 0.7)",
  padding: "4px",
  backdropFilter: "blur(8px)",
  background: "rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  "&:hover": {
    background: "rgba(0, 0, 0, 0.2)",
  },
}));

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
            <InfoIconStyled size="large">
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
        <CreateLinkUpButton
          type="submit"
          aria-label="create-linkup"
          size="large"
        >
          POST
        </CreateLinkUpButton>
        <ClearFormButton
          type="button"
          onClick={handleClearForm}
          aria-label="clear-form"
          size="large"
        >
          CLEAR FORM
        </ClearFormButton>
      </Form>
    </WidgetContainer>
  );
};

export default CreateLinkupWidget;
