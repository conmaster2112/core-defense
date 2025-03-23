import { Vec2 } from "../../math";
import { AnimationRotationVisualProperty } from "./rotation-visual-property";
import { AnimationScaleVisualProperty } from "./scale-visual-property";
import { AnimationTranslateVisualProperty } from "./translate-visual-property";
import { AnimationVisualProperty } from "./visual-property";

export * from "./animation";
export * from "./visual-property";
export * from "./rotation-visual-property";
export * from "./state";
export * from "./custom-function";

export class AnimationTypes {
    private constructor(){}
    public static rotation(rad: number): AnimationVisualProperty{ return new AnimationRotationVisualProperty(rad); }
    public static translation(offset: Vec2): AnimationVisualProperty{ return new AnimationTranslateVisualProperty(offset); }
    public static scale(scale: Vec2): AnimationVisualProperty{ return new AnimationScaleVisualProperty(scale); }
}