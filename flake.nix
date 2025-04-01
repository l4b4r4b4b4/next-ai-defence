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
            pkgs.zed-editor-fhs
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
          ];

          # Environment variables and setup
          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"

            echo "next-ai-defence development environment loaded!"
            echo "Run 'bun test' to run tests"
            echo "Run 'bun run build' to build the package"
            zeditor .
            bun test:watch
          '';
        };
      }
    );
}
