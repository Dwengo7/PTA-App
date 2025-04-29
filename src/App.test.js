// App.test.js
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("App component", () => {
  it("renders the Header component", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("redirects to login on unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("renders the Home page on /home route", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it("renders the Teacher Home page on /teacherhome route", () => {
    render(
      <MemoryRouter initialEntries={["/teacherhome"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/teacher home/i)).toBeInTheDocument();
  });

  it("renders the Calendar page on /calendar route", () => {
    render(
      <MemoryRouter initialEntries={["/calendar"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/calendar/i)).toBeInTheDocument();
  });
});
