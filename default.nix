{ pkgs ? import <nixpkgs> { } }:

(pkgs.callPackage ./yarn-project.nix { } { src = ./.; }).overrideAttrs (attrs: {
  buildPhase = ''
    runHook preBuild
    yarn build
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall
    cp -R dist $out
    runHook postInstall
  '';
})
