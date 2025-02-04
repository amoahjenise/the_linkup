import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider, useSnackbar } from "../../contexts/SnackbarContext";
import NotificationTestPage from "./NotificationTestPage";

// Mock the useSnackbar hook
jest.mock("./contexts/SnackbarContext", () => ({
  useSnackbar: jest.fn(),
}));

describe("NotificationTestPage", () => {
  it("displays a notification when a simulated notification is received", () => {
    // Mock the addSnackbar function from useSnackbar
    const addSnackbarMock = jest.fn();
    useSnackbar.mockReturnValue({ addSnackbar: addSnackbarMock });

    // Render the component
    render(
      <SnackbarProvider>
        <NotificationTestPage />
      </SnackbarProvider>
    );

    // Simulate receiving a notification
    const simulatedNotification = {
      type: "message",
      content: "New message from John",
    };
    userEvent.click(screen.getByText("Simulate Notification"));

    // Verify that the addSnackbar function was called with the correct notification content
    expect(addSnackbarMock).toHaveBeenCalledWith(simulatedNotification.content);
  });
});
