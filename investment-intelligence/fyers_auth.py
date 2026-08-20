import argparse
import os
from pathlib import Path

from dotenv import load_dotenv
from fyers_apiv3 import fyersModel


PROJECT_DIR = Path(__file__).resolve().parent
ENV_FILE = PROJECT_DIR / ".env"
load_dotenv(ENV_FILE)


def build_session() -> fyersModel.SessionModel:
    client_id = os.getenv("FYERS_APP_ID", "")
    redirect_uri = os.getenv("FYERS_REDIRECT_URI", "http://localhost:5173")

    if not client_id:
        raise SystemExit("FYERS_APP_ID is missing from .env")

    return fyersModel.SessionModel(
        client_id=client_id,
        redirect_uri=redirect_uri,
        response_type="code",
        grant_type="authorization_code",
    )


def save_access_token(token: str) -> None:
    lines = ENV_FILE.read_text(encoding="utf-8").splitlines()
    updated = False
    output = []

    for line in lines:
        if line.startswith("FYERS_ACCESS_TOKEN="):
            output.append(f"FYERS_ACCESS_TOKEN={token}")
            updated = True
        else:
            output.append(line)

    if not updated:
        output.append(f"FYERS_ACCESS_TOKEN={token}")

    ENV_FILE.write_text("\n".join(output) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Start or complete FYERS authentication")
    parser.add_argument("--auth-code", help="The auth_code from the FYERS redirect URL")
    args = parser.parse_args()

    session = build_session()

    if not args.auth_code:
        print("Open this URL in your browser:")
        print(session.generate_authcode())
        print("\nAfter login, run this script again with the auth_code from the redirect URL.")
        return

    secret_id = os.getenv("FYERS_SECRET_ID", "")
    if not secret_id:
        raise SystemExit("FYERS_SECRET_ID is missing from .env")

    session.set_token(args.auth_code)
    response = session.generate_token()
    if response.get("code") != 200 or not response.get("access_token"):
        raise SystemExit(f"FYERS token exchange failed: {response}")

    save_access_token(response["access_token"])
    print("FYERS access token saved to .env. Restart the backend to enable live prices.")


if __name__ == "__main__":
    main()
