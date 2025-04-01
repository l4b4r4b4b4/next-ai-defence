{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import (inputs.nixpkgs) {inherit system;};
      in {
        devShell = pkgs.mkShell {
          buildInputs = [
            # Core dependencies
            pkgs.bun
            pkgs.nodejs_20
            pkgs.nodePackages.typescript
            pkgs.nodePackages.typescript-language-server

            # Development utilities
            pkgs.git
            pkgs.gh # GitHub CLI for managing releases
            pkgs.nodePackages.npm # For publishing to npm registry

            # Testing and code quality
            pkgs.nodePackages.prettier
            pkgs.nodePackages.eslint
            pkgs.nodePackages.husky

            # Documentation
            pkgs.nodePackages.typedoc

            # Next.js related (for testing integration)
            pkgs.nodePackages.next
            pkgs.nodePackages.react
            pkgs.nodePackages.react-dom
          ];

          # Environment variables and setup
          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"

            # Check if husky is already installed in the project
            if [ ! -d ".husky" ]; then
              echo "Setting up Husky git hooks..."
              # Check if package.json exists
              if [ -f "package.json" ]; then
                # Add husky as a dev dependency if not already present
                if ! grep -q '"husky"' package.json; then
                  echo "Adding husky to package.json..."
                  bun add -D husky
                fi

                # Initialize husky
                npx husky init

                # Create a pre-push hook that runs tests
                cat > .husky/pre-push << 'EOF'
            #!/usr/bin/env sh
            . "$(dirname -- "$0")/_/husky.sh"

            echo "Running tests before push..."
            bun test
            EOF
                chmod +x .husky/pre-push

                echo "Husky setup complete!"
              else
                echo "No package.json found. Skipping Husky setup."
              fi
            else
              echo "Husky is already set up."
            fi

            echo "next-ai-defence development environment loaded!"
            echo "Run 'bun test' to run tests"
            echo "Run 'bun run build' to build the package"
          '';
        };
      }
    );
}
