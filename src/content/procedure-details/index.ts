// 시술 상세 원고 (54개). 모두 원장님 검수 전 초안.
import type { ProcedureDetail } from "./common";
import { boosters, fillers } from "./filler-booster";
import { hair, injections, tattoo } from "./injection-etc";
import { botoxes, lifting } from "./lifting-botox";
import { acne, scarPore, skinCare, toning } from "./skin";

export type { ProcedureDetail };

export const procedureDetails: Record<string, ProcedureDetail> = {
  ...lifting,
  ...botoxes,
  ...fillers,
  ...boosters,
  ...toning,
  ...skinCare,
  ...scarPore,
  ...acne,
  ...injections,
  ...hair,
  ...tattoo,
};
