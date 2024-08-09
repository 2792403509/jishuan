export const compaction = (formdata) => {
	//// (（（湿土质量 + 托盘质量）-托盘质量）*量砂密度)/((量砂容器+原有砂质量)-(量砂容器+剩余砂质量))*(1+含水率)*最大干密度
	return ((Number(formdata.wetSoil) - Number(formdata.tray)) * Number(formdata.sand)) / ((Number(formdata
			.canister) -
		Number(
			formdata.residue)) * (1 + Number(formdata.water)) * Number(formdata.density))
}