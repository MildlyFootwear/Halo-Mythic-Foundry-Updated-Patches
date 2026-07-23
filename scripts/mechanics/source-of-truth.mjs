import { getSkillTierBonus } from "../reference/ref-utils.mjs";

const NATURAL_ARMOR_DEFAULT = Object.freeze({
  enabled: false,
  baseValue: 0,
  effectiveValue: 0,
  headShotValue: 0,
  isWearingArmor: false,
  halvedWhenArmored: false,
  halvedOnHeadshot: false,
  notes: "",
});

function asFiniteNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function asNonNegativeFiniteNumber(value) {
  return Math.max(0, asFiniteNumber(value));
}

export function getFinalCharacteristic(actor, key) {
  return asFiniteNumber(actor?.system?.characteristics?.[key]);
}

export function getCharacteristicModifier(actor, key) {
  return asFiniteNumber(actor?.system?.characteristicModifiers?.[key]);
}

export function getFinalMythicCharacteristic(actor, key) {
  return asFiniteNumber(actor?.system?.mythic?.characteristics?.[key]);
}

export function getNaturalArmorState(actor) {
  const source = actor?.system?.combat?.naturalArmor;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return { ...NATURAL_ARMOR_DEFAULT };
  }
  return {
    enabled: source.enabled === true,
    baseValue: asNonNegativeFiniteNumber(source.baseValue),
    effectiveValue: asNonNegativeFiniteNumber(source.effectiveValue),
    headShotValue: asNonNegativeFiniteNumber(source.headShotValue),
    isWearingArmor: source.isWearingArmor === true,
    halvedWhenArmored: source.halvedWhenArmored === true,
    halvedOnHeadshot: source.halvedOnHeadshot === true,
    notes: String(source.notes ?? ""),
  };
}

export function getActorSkillTarget(actor, skillKey, options = {}) {
  const normalizedKey = String(skillKey ?? "").trim().toLowerCase();
  const skill = actor?.system?.skills?.base?.[normalizedKey] ?? {};
  const characteristicKey = String(
    options.characteristicKey ?? skill.selectedCharacteristic ?? "",
  )
    .trim()
    .toLowerCase();
  const characteristic = getFinalCharacteristic(actor, characteristicKey);
  const tierBonus = getSkillTierBonus(
    skill.tier ?? "untrained",
    skill.category ?? "basic",
  );
  const skillModifier = asFiniteNumber(skill.modifier);
  const testModifier = asFiniteNumber(options.testModifier);
  return characteristic + tierBonus + skillModifier + testModifier;
}

export function getActorEvasionTarget(actor, options = {}) {
  return getActorSkillTarget(actor, "evasion", {
    ...options,
    characteristicKey: "agi",
  });
}
