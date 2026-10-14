(() => {
  "use strict";

  // Supabase connection configuration
  const SUPABASE_URL = "https://nslcijqfkiubzpkhjveb.supabase.co/rest/v1/";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dGTtyItlTSZMxTG0Tr2hmg_iN7E3qXA";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  // This directory is deliberately honest: it guides visitors to official services,
  // but cannot check live country routes or initiate/confirm a transfer.
  const providers = [
    {name:"WorldRemit",url:"https://www.worldremit.com/",description:"Open the official site and check whether your sending country can send to Ghana with MTN Mobile Money as the payout method."},
    {name:"Remitly",url:"https://www.remitly.com/",description:"Choose your sending country on Remitly, set Ghana as the destination, and confirm that mobile-wallet delivery is offered."},
    {name:"Western Union",url:"https://www.westernunion.com/",description:"Check the route from your country to Ghana and review the available receiving methods before paying."},
    {name:"MoneyGram",url:"https://www.moneygram.com/",description:"Check the sending location, Ghana destination, recipient eligibility, fees, and available payout options."}
  ];
  const countries = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan",
    "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
    "Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Costa Rica","Croatia","Cuba","Cyprus","Czechia",
    "Democratic Republic of the Congo","Denmark","Djibouti","Dominican Republic",
    "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
    "Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Guatemala","Guinea","Guinea-Bissau","Guyana",
    "Haiti","Honduras","Hong Kong","Hungary",
    "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast",
    "Jamaica","Japan","Jordan",
    "Kazakhstan","Kenya","Kuwait","Kyrgyzstan",
    "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
    "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
    "Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
    "Oman","Pakistan","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
    "Qatar","Republic of the Congo","Romania","Russia","Rwanda",
    "Saint Lucia","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
    "Taiwan","Tajikistan","Tanzania","Thailand","Togo","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
    "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
    "Vatican City","Venezuela","Vietnam",
    "Yemen","Zambia","Zimbabwe","Other country"
  ];

  const countrySelect = document.getElementById("sendingCountry");
  const countrySearch = document.getElementById("countrySearch");
  const form = document.getElementById("finderForm");
  const payoutSelect = document.getElementById("payoutMethod");
  const results = document.getElementById("providerResults");
  const resultsStatus = document.getElementById("resultsStatus");
  const copyFeedback = document.getElementById("copyFeedback");

  function fillCountries(filter = "") {
    const previous = countrySelect.value;
    countrySelect.replaceChildren(new Option("Select a country", ""));
    countries.filter(country => country.toLowerCase().includes(filter.trim().toLowerCase()))
      .forEach(country => countrySelect.add(new Option(country, country)));
    if ([...countrySelect.options].some(option => option.value === previous)) countrySelect.value = previous;
  }
  fillCountries();
  countrySearch.addEventListener("input", () => {
    const current = countrySelect.value;
    fillCountries(countrySearch.value);
    if (current && [...countrySelect.options].some(option => option.value === current)) countrySelect.value = current;
    else countrySelect.value = "";
  });

  const payoutLabels = {
    momo: "MTN Mobile Money wallet",
    mobile: "another mobile money wallet",
    bank: "bank deposit",
    cash: "cash pickup"
  };

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function renderResults(country, payout) {
    results.replaceChildren();

    const summary = makeElement("div", "route-summary");
    summary.append(
      makeElement("h3", "", "Your transfer checklist"),
      makeElement("p", "", `Sending from ${country} to Ghana · Preferred payout: ${payoutLabels[payout]}.`),
      makeElement("p", "route-summary-note", "No live connection is available to confirm which provider supports this exact route. Open a provider below and confirm the details before sending.")
    );
    results.append(summary);

    if (country === "Ghana") {
      const domestic = makeElement("div", "route-warning", "You selected Ghana as the sending country. For a transfer within Ghana, an international remittance provider may not be appropriate; use a legitimate domestic transfer method instead.");
      results.append(domestic);
    }

    providers.forEach((provider, index) => {
      const card = makeElement("article", "provider-card");
      const head = makeElement("div", "provider-head");
      const logo = makeElement("div", `provider-logo provider-logo-${index + 1}`, provider.name.slice(0, 1));
      logo.setAttribute("aria-hidden", "true");
      const titleWrap = makeElement("div", "");
      titleWrap.append(
        makeElement("h3", "", provider.name),
        makeElement("span", "provider-type", "Official provider website")
      );
      head.append(logo, titleWrap);

      const description = makeElement("p", "provider-description", provider.description);
      const status = makeElement("div", "provider-status");
      status.append(
        makeElement("span", "status-pill status-unknown", "Check route on provider site"),
        makeElement("span", "provider-payout", `Payout: ${payoutLabels[payout]}`)
      );
      const steps = makeElement("ol", "provider-checklist");
      ["Select your sending country", "Set Ghana as the destination", `Confirm ${payoutLabels[payout]} is available`, "Review recipient details, fees, exchange rate, and delivery estimate"].forEach(step => steps.append(makeElement("li", "", step)));

      const actions = makeElement("div", "card-actions");
      const link = makeElement("a", "button button-secondary button-small", "Check on official site ↗");
      link.href = provider.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      actions.append(link);
      card.append(head, description, status, steps, actions);
      results.append(card);
    });

    resultsStatus.textContent = `Guide prepared for ${country} to Ghana. These are official sites to check, not confirmed matches. No transfer has been started.`;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const country = countrySelect.value;
    if (!country) {
      resultsStatus.textContent = "Please select a sending country first.";
      countrySelect.focus();
      return;
    }
    renderResults(country, payoutSelect.value);
  });

  async function copyText(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        const ok = document.execCommand("copy");
        field.remove();
        if (!ok) throw new Error("Clipboard unavailable");
      }
      return true;
    } catch { return false; }
  }

  document.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");
    const ok = await copyText(value);
    const message = ok ? `Copied: ${value}` : "Copy was blocked by your browser. Please select and copy the details manually.";
    const preview = button.closest(".recipient-preview");
    if (preview) {
      const feedback = preview.querySelector(".copy-feedback");
      if (feedback) feedback.textContent = message;
    }
    if (copyFeedback) copyFeedback.textContent = message;
    if (!preview && !copyFeedback) button.setAttribute("aria-label", message);
  }));

  
  // Public profiles will be loaded from Supabase.
  // Private recipient details must never be saved to the public profiles table.
  const publicProfiles = [];
  const profileList = document.getElementById("profileList");
  const profileSearch = document.getElementById("profileSearch");
  const profileRegion = document.getElementById("profileRegion");
  const profileMethod = document.getElementById("profileMethod");
  
  // Supabase account authentication
  const accountEmailInput = document.getElementById("accountEmail");
  const accountPasswordInput = document.getElementById("accountPassword");
  const accountStatus = document.getElementById("accountStatus");
  const signUpButton = document.getElementById("signUpButton");
  const signInButton = document.getElementById("signInButton");
  const signOutButton = document.getElementById("signOutButton");

  function showAccountStatus(message) {
    accountStatus.textContent = message;
  }

  function updateAccountButtons(session) {
    const signedIn = Boolean(session);

    signUpButton.hidden = signedIn;
    signInButton.hidden = signedIn;
    signOutButton.hidden = !signedIn;

    accountEmailInput.disabled = signedIn;
    accountPasswordInput.disabled = signedIn;

    showAccountStatus(
      signedIn
        ? "You are signed in. You can now manage your account."
        : "Sign in or create an account to continue."
    );
  }

  signUpButton.addEventListener("click", async () => {
    const email = accountEmailInput.value.trim();
    const password = accountPasswordInput.value;

    if (!email || password.length < 8) {
      showAccountStatus("Enter a valid email and a password of at least 8 characters.");
      return;
    }

    signUpButton.disabled = true;
    showAccountStatus("Creating your account...");

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      if (data.session) {
        updateAccountButtons(data.session);
      } else {
        showAccountStatus(
          "Account request received. Check your email for a confirmation link before signing in."
        );
      }
    } catch (error) {
      showAccountStatus(error.message || "Could not create your account.");
    } finally {
      signUpButton.disabled = false;
    }
  });

  signInButton.addEventListener("click", async () => {
    const email = accountEmailInput.value.trim();
    const password = accountPasswordInput.value;

    if (!email || !password) {
      showAccountStatus("Enter your email and password.");
      return;
    }

    signInButton.disabled = true;
    showAccountStatus("Signing in...");

    try {
      const { data, error } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      updateAccountButtons(data.session);
    } catch (error) {
      showAccountStatus(error.message || "Could not sign in.");
    } finally {
      signInButton.disabled = false;
    }
  });

  signOutButton.addEventListener("click", async () => {
    signOutButton.disabled = true;
    showAccountStatus("Signing out...");

    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) throw error;

      updateAccountButtons(null);
      accountPasswordInput.value = "";
    } catch (error) {
      showAccountStatus(error.message || "Could not sign out.");
    } finally {
      signOutButton.disabled = false;
    }
  });

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      showAccountStatus("Could not check your sign-in status. Please refresh.");
      return;
    }

    updateAccountButtons(data.session);
  });

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    updateAccountButtons(session);
  });

  const registrationForm = document.getElementById("registrationForm");
  const registrationStatus = document.getElementById("registrationStatus");
  const privateForm = document.getElementById("privateRecipientForm");
  const privateResult = document.getElementById("privateResult");
  const privatePhone = document.getElementById("privatePhone");

  function renderProfiles() {
    if (!profileList) return;
    const query = (profileSearch?.value || "").trim().toLowerCase();
    const region = profileRegion?.value || "";
    const method = profileMethod?.value || "";
    const filtered = publicProfiles.filter(profile => {
      const matchesQuery = `${profile.name} ${profile.region} ${profile.method} ${profile.note}`.toLowerCase().includes(query);
      return matchesQuery && (!region || profile.region === region) && (!method || profile.method === method);
    });
    profileList.replaceChildren();
    if (!filtered.length) {
      const empty = makeElement("div", "empty-state");
      empty.append(
        makeElement("span", "empty-icon", "⌕"),
        makeElement("h3", "", publicProfiles.length ? "No profiles match your filters" : "No public profiles yet"),
        makeElement("p", "", publicProfiles.length ? "Try a different name, region, or receiving method." : "Register a voluntary profile to preview how it will appear. In this demo, profiles are visible only in this browser session."),
      );
      if (!publicProfiles.length) {
        const link = makeElement("a", "button button-primary", "Register a profile");
        link.href = "#register";
        empty.append(link);
      }
      profileList.append(empty);
      return;
    }
    filtered.forEach(profile => {
      const card = makeElement("article", "profile-card");
      const head = makeElement("div", "profile-card-head");
      const initials = makeElement("div", "profile-initials", profile.name.trim().split(/\s+/).slice(0, 2).map(part => part.charAt(0).toUpperCase()).join(""));
      initials.setAttribute("aria-hidden", "true");
      const identity = makeElement("div", "");
      identity.append(makeElement("h3", "", profile.name), makeElement("span", "profile-region", profile.region));
      head.append(initials, identity);
      const meta = makeElement("div", "profile-meta");
      meta.append(makeElement("span", "profile-tag", profile.method), makeElement("span", "profile-tag", "Opt-in profile"));
      card.append(head, meta);
      if (profile.note) card.append(makeElement("p", "profile-note", profile.note));
      const privacy = makeElement("p", "fine-print", "No phone number or financial account details are shown publicly.");
      card.append(privacy);
      profileList.append(card);
    });
  }

  [profileSearch, profileRegion, profileMethod].forEach(control => {
    if (control) control.addEventListener(control.tagName === "INPUT" ? "input" : "change", renderProfiles);
  });

  if (registrationForm) {
    registrationForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = document.getElementById("displayName").value.trim();
      const region = document.getElementById("registerRegion").value;
      const method = document.getElementById("registerMethod").value;
      const note = document.getElementById("profileNote").value.trim();
      const consent = document.getElementById("publicConsent").checked;
      if (!name || !region || !method || !consent) {
        registrationStatus.hidden = false;
        registrationStatus.textContent = "Complete the required fields and confirm public-profile consent before previewing.";
        return;
      }
      // Do not accept obvious phone numbers or email addresses in a public note.
      if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(note) || /(?:\+?\d[\d\s().-]{7,}\d)/.test(note)) {
        registrationStatus.hidden = false;
        registrationStatus.textContent = "Please remove phone numbers and email addresses from the public note. Public profiles should not expose private contact details.";
        return;
      }
      publicProfiles.unshift({ name: name.slice(0, 50), region, method, note: note.slice(0, 160) });
      renderProfiles();
      registrationStatus.hidden = false;
      registrationStatus.textContent = "Your profile preview has been added to the public directory on this browser only. It has not been uploaded, saved to a server, or made visible to other visitors. A secure backend is needed for real registration.";
      registrationForm.reset();
      document.getElementById("public-directory").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (privateForm) {
    privateForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = document.getElementById("privateName").value.trim();
      const region = document.getElementById("privateRegion").value;
      const method = document.getElementById("privateMethod").value;
      const phone = privatePhone.value.trim();
      if (!name || !method) {
        privateResult.hidden = false;
        privateResult.textContent = "Enter the recipient's name and receiving method to prepare the checklist.";
        return;
      }
      const lines = [
        `Private recipient checklist`,
        `Recipient name: ${name}`,
        region ? `Region: ${region}` : "Region: not specified",
        `Receiving method: ${method}`,
        phone ? `Recipient phone: ${phone}` : "Recipient phone: not entered",
        "Next: choose a provider that supports the sender's country and this payout method, then enter the details on the provider's official platform."
      ];
      privateResult.replaceChildren();
      privateResult.hidden = false;
      privateResult.append(makeElement("span", "result-title", "Your private checklist is ready"), makeElement("p", "", lines.join("\n")));
      const copyButton = makeElement("button", "button button-secondary button-small", "Copy checklist");
      copyButton.type = "button";
      copyButton.addEventListener("click", async () => {
        const copied = await copyText(lines.join("\n"));
        privateResult.append(makeElement("p", "copy-feedback", copied ? "Checklist copied to your clipboard." : "Copy was blocked. Please select and copy the text manually."));
      });
      const clearButton = makeElement("button", "button button-secondary button-small", "Clear checklist");
      clearButton.type = "button";
      clearButton.addEventListener("click", () => {
        privateForm.reset();
        privateResult.replaceChildren();
        privateResult.hidden = true;
      });
      privateResult.append(copyButton, clearButton);
      privateResult.style.whiteSpace = "pre-line";
    });
  }

  const clearPrivate = document.getElementById("clearPrivate");
  if (clearPrivate) clearPrivate.addEventListener("click", () => {
    privateForm?.reset();
    if (privateResult) { privateResult.replaceChildren(); privateResult.hidden = true; }
  });

  renderProfiles();

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("primaryNav");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }));
  document.getElementById("year").textContent = new Date().getFullYear();
})();
