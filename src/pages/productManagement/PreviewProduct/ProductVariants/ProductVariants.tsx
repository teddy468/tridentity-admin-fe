import styles from "./product-variants.module.scss";
import {
  formatPrice,
  isIncludedSelectedVariant,
  ProductAttribute,
  ProductVariation,
  SelectedVariant,
} from "../PreviewProduct";
import { isEqual } from "lodash";

interface ProductVariantsProps {
  oldAttributes: ProductAttribute[] | undefined;
  attributes: ProductAttribute[];
  selectedVariants: SelectedVariant[];
  setSelectedVariant: (variant: SelectedVariant) => void;
  oldSelectedVariants: SelectedVariant[];
  setSelectedVariantProductBeforeUpdate: (variant: SelectedVariant) => void;
  isHighline: boolean;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  attributes,
  oldAttributes,
  selectedVariants,
  setSelectedVariant,
  oldSelectedVariants,
  setSelectedVariantProductBeforeUpdate,
  isHighline,
}: ProductVariantsProps) => {
  const isAttibuteDiffer = isEqual(attributes, oldAttributes);
  return (
    <div className={styles.wrapper}>
      {attributes.map((attribute) => (
        <div className={styles.attribute} key={attribute.attribute_name}>
          <div className={styles.label}>
            {attribute.attribute_name}{" "}
            {attribute.is_required && (
              <span className={styles.required}>*</span>
            )}{" "}
            {!attribute.is_multiple_choice && <span>(Optional)</span>}
          </div>
          <div className={styles.variants}>
            {attribute.variants?.map((variant: ProductVariation) => (
              <div
                className={[
                  styles.variant,
                  !isAttibuteDiffer && isHighline ? styles.different : "",
                  isIncludedSelectedVariant(
                    {
                      ...variant,
                      attribute_name: attribute.attribute_name,
                      is_required: attribute.is_required,
                      is_multiple_choice: attribute.is_multiple_choice,
                    },
                    selectedVariants
                  )
                    ? styles.active
                    : "",
                ].join(" ")}
                key={variant.attribute_value}
                onClick={() => {
                  setSelectedVariant({
                    ...variant,
                    attribute_name: attribute.attribute_name,
                    is_required: attribute.is_required,
                    is_multiple_choice: attribute.is_multiple_choice,
                  });
                  // setSelectedVariantProductBeforeUpdate({

                  // })
                }}
              >
                {variant.attribute_value}{" "}
                <span className={styles.price}>
                  {variant.price > 0 ? formatPrice(variant.price) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariants;
