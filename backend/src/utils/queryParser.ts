export function parseFilterData(
  query: any,
): { isActive?: boolean; actionType?: string } | undefined {
  const filter: any = {};

  const isActiveRaw = query["filterData[isActive]"];

  // only apply isActive filter if it was explicitly sent with a value
  if (isActiveRaw !== undefined && isActiveRaw !== "" && isActiveRaw !== null) {
    // convert to boolean properly
    filter.isActive =
      isActiveRaw === "true" || isActiveRaw === true || isActiveRaw === "1";
  }

  // actionType (only if sent and not empty)
  const actionTypeRaw = query["filterData[actionType]"];
  if (actionTypeRaw !== undefined && actionTypeRaw !== "") {
    filter.actionType = String(actionTypeRaw);
  }

  // return undefined if no filters were sent
  return Object.keys(filter).length > 0 ? filter : undefined;
}
