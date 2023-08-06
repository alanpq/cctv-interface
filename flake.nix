{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    gitignore = {
      url = "github:hercules-ci/gitignore.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    { self
    , nixpkgs
    , gitignore
    , flake-utils
    , ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        packageJSON = pkgs.lib.importJSON ./package.json;
        gitignoreSource = gitignore.lib.gitignoreSource;
      in
      {
        packages = rec {
          site-src = pkgs.mkYarnPackage rec {
            name = "${packageJSON.name}-site-${version}";
            version = packageJSON.version;
            src = gitignoreSource ./.;
            packageJson = "${src}/package.json";
            yarnLock = "${src}/yarn.lock";
            buildPhase = ''
              yarn --offline build
            '';
            # distPhase = "true";
          };

          image = pkgs.dockerTools.buildLayeredImage {
            name = "${packageJSON.name}";
            tag = packageJSON.version;
            contents = [ site-src pkgs.nodejs ];
            config = {
              Cmd = [ "node" "${site-src}/libexec/${packageJSON.name}/deps/${packageJSON.name}/build" ];
              ExposedPorts = {
                "3000/tcp" = { };
              };
            };
          };

          default = pkgs.writeShellApplication {
            name = packageJSON.name;
            runtimeInputs = [ site-src pkgs.nodejs ];
            text = ''
              node ${site-src}/libexec/${packageJSON.name}/deps/${packageJSON.name}/build
            '';
          };
        };

        devShell = pkgs.mkShell {
          buildInputs = [ pkgs.yarn pkgs.nodejs ];
        };
      }
    );
}
