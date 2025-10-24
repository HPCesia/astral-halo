{
  description = "Astral Halo - A Static Blog Generator Powered by Astro";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import inputs.nixpkgs {inherit system;};
    in {
      devShell = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_22
          pnpm_10
        ];
      };
    });
}
