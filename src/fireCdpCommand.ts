export async function fireCdpCommand(
  command: string,
  params: Record<string, unknown>
): Promise<void> {
  return Cypress.automation("remote:debugger:protocol", {
    command,
    params,
  }).catch((e) => {
    throw new Error(
      `Failed request to chrome devtools protocol. This can happen if cypress lost connection to the browser or the command itself is not valid. Original cypress error: ${e}`
    );
  });
}
