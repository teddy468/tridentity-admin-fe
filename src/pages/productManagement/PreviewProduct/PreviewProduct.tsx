import { Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";

import styles from "./preview-product.module.scss";
import ProductDetailHeader from "./ProductDetailHeader/ProductDetailHeader";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedlnIcon,
  LogoFull,
  NoAvatar,
  Notification,
  SearchIcon,
  ShoppingCart,
  SmsIcon,
  TwitterIcon,
} from "../../../assets/icons";
import CustomInput from "../CustomInput/CustomInput";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";

export const getNumberOnRange = (
  x: number,
  min: number,
  max: number
): number => {
  return Math.min(max, Math.max(min, x));
};

export interface ProductVariation {
  attribute_value: string;
  price: number;
  total_quantity: number;
}

export type ProductAttribute = {
  attribute_name: string;
  is_required: boolean;
  is_multiple_choice: boolean;
  variants: ProductVariation[];
};

export interface MerchantStoreAddress {
  id: number;
  merchant_store_id: number;
  address: string;
  description: string;
  phone: string;
  coordinate: {
    lat: string;
    lng: string;
  };
  status: number;
  country: string;
  district: string;
  city_or_province: string;
  postal_code: string;
}

export interface SelectedVariant {
  attribute_name: string;
  attribute_value: string;
  price: number;
  total_quantity: number;
  is_required: boolean;
  is_multiple_choice: boolean;
}

declare interface ISocialMedia {
  icon: JSX.Element;
  link: string;
  name: string;
}

export const formatPrice = (price: number) => {
  return (
    "S$ " +
    new Intl.NumberFormat("en-US", { maximumSignificantDigits: 3 }).format(
      price
    )
  );
};

export const isIncludedSelectedVariant = (
  variant: SelectedVariant,
  selectedVariants: SelectedVariant[]
) => {
  return (
    selectedVariants.findIndex(
      (selectedVariant) =>
        selectedVariant.attribute_name === variant.attribute_name &&
        selectedVariant.attribute_value === variant.attribute_value
    ) !== -1
  );
};

export const isSelectedVariant = (
  variant: SelectedVariant,
  selectedVariant: SelectedVariant
) => {
  return (
    selectedVariant.attribute_name === variant.attribute_name &&
    selectedVariant.attribute_value === variant.attribute_value
  );
};
export const FOOTER_ITEMS = [
  "Marketplace",
  "Privacy Policy",
  "Seller Center",
  "News & Events",
  "Terms of Service",
];

export const socialMediaItems: ISocialMedia[] = [
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/",
    icon: <LinkedlnIcon />,
  },
  {
    name: "Facebook",
    link: "https://www.facebook.com/",
    icon: <FacebookIcon />,
  },
  {
    name: "Twitter",
    link: "https://twitter.com/",
    icon: <TwitterIcon />,
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/",
    icon: <InstagramIcon />,
  },
];
interface PreviewProductProps extends ModalProps {
  className?: string;
  images: string[];
  name: string;
  price: number;
  description: string;
  hashtags?: string[];
  attributes: ProductAttribute[];
  merchant_store_id: number;
  tag: string;
  productBeforeUpdate?: Product;
}
const PreviewProduct: React.FC<PreviewProductProps> = (
  props: PreviewProductProps
) => {
  const {
    className,
    attributes,
    description,
    merchant_store_id,
    images,
    name,
    price,
    tag,
    hashtags,
    productBeforeUpdate,
    ...modalProps
  } = props;
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>(
    []
  );
  const [oldSelectedVariants, setOldSelectedVariants] = useState<
    SelectedVariant[]
  >([]);
  const [isHighline, setIsHighline] = useState(false);

  const handleSelectedVariants = (variant: SelectedVariant) => {
    if (variant.is_required) {
      if (!isIncludedSelectedVariant(variant, selectedVariants)) {
        const newSelectedVariants = selectedVariants.filter(
          (selectedVariant) =>
            selectedVariant.attribute_name !== variant.attribute_name
        );
        setSelectedVariants([...newSelectedVariants, variant]);
      }
    } else {
      if (variant.is_multiple_choice) {
        if (isIncludedSelectedVariant(variant, selectedVariants)) {
          setSelectedVariants(
            selectedVariants.filter(
              (selectedVariant) => !isSelectedVariant(selectedVariant, variant)
            )
          );
        } else {
          setSelectedVariants([...selectedVariants, variant]);
        }
      } else {
        if (!isIncludedSelectedVariant(variant, selectedVariants)) {
          const newSelectedVariants = selectedVariants.filter(
            (selectedVariant) =>
              selectedVariant.attribute_name !== variant.attribute_name
          );
          setSelectedVariants([...newSelectedVariants, variant]);
        } else {
          setSelectedVariants(
            selectedVariants.filter(
              (selectedVariant) => !isSelectedVariant(selectedVariant, variant)
            )
          );
        }
      }
    }
  };

  const handleSelectedVariantsProductBeforeUpdate = (
    variant: SelectedVariant
  ) => {
    if (variant.is_required) {
      if (!isIncludedSelectedVariant(variant, oldSelectedVariants)) {
        const newSelectedVariants = oldSelectedVariants.filter(
          (selectedVariant) =>
            selectedVariant.attribute_name !== variant.attribute_name
        );
        setOldSelectedVariants([...newSelectedVariants, variant]);
      }
    } else {
      if (variant.is_multiple_choice) {
        if (isIncludedSelectedVariant(variant, oldSelectedVariants)) {
          setOldSelectedVariants(
            oldSelectedVariants.filter(
              (selectedVariant) => !isSelectedVariant(selectedVariant, variant)
            )
          );
        } else {
          setOldSelectedVariants([...oldSelectedVariants, variant]);
        }
      } else {
        if (!isIncludedSelectedVariant(variant, oldSelectedVariants)) {
          const newSelectedVariants = oldSelectedVariants.filter(
            (selectedVariant) =>
              selectedVariant.attribute_name !== variant.attribute_name
          );
          setOldSelectedVariants([...newSelectedVariants, variant]);
        } else {
          setOldSelectedVariants(
            oldSelectedVariants.filter(
              (selectedVariant) => !isSelectedVariant(selectedVariant, variant)
            )
          );
        }
      }
    }
  };

  useEffect(() => {
    const requiredVariant: SelectedVariant[] = [];
    const oldRequiredVariant: SelectedVariant[] = [];
    if (attributes?.length > 0) {
      attributes.forEach((attribute: ProductAttribute) => {
        if (attribute.is_required) {
          let minPriceVariant = attribute.variants?.[0] || 0;
          attribute.variants?.forEach((variant: ProductVariation) => {
            if (variant.price < minPriceVariant.price) {
              minPriceVariant = variant;
            }
          });
          requiredVariant.push({
            ...minPriceVariant,
            attribute_name: attribute.attribute_name,
            is_multiple_choice: attribute.is_multiple_choice,
            is_required: attribute.is_required,
          });
        }
      });
      setSelectedVariants(requiredVariant);
    }

    if (productBeforeUpdate && productBeforeUpdate?.attributes?.length > 0) {
      productBeforeUpdate.attributes.forEach((attribute: ProductAttribute) => {
        if (attribute.is_required) {
          let minPriceVariant = attribute.variants?.[0] || 0;
          attribute.variants?.forEach((variant: ProductVariation) => {
            if (variant.price < minPriceVariant.price) {
              minPriceVariant = variant;
            }
          });
          oldRequiredVariant.push({
            ...minPriceVariant,
            attribute_name: attribute.attribute_name,
            is_multiple_choice: attribute.is_multiple_choice,
            is_required: attribute.is_required,
          });
        }
      });
      setOldSelectedVariants(oldRequiredVariant);
    }
  }, [attributes, productBeforeUpdate]);

  return (
    <Modal
      title={
        <div className={styles.closeIcon}>
          <p>Preview</p>
          <EyeOutlined
            onClick={(e) => {
              e.preventDefault();
              setIsHighline(!isHighline);
            }}
          />
        </div>
      }
      footer={null}
      className={[styles.previewProduct, className].join(" ")}
      {...modalProps}
    >
      <div className={styles.content}>
        <ProductDetailHeader
          tag={tag}
          merchant_store_id={merchant_store_id}
          selectedVariants={selectedVariants}
          oldSelectedVariants={oldSelectedVariants}
          attributes={attributes}
          setSelectedVariant={handleSelectedVariants}
          setSelectedVariantProductBeforeUpdate={
            handleSelectedVariantsProductBeforeUpdate
          }
          hashtags={hashtags}
          description={description}
          price={price}
          images={images}
          name={name}
          productBeforeUpdate={productBeforeUpdate}
          isHighline={isHighline}
        />
      </div>
    </Modal>
  );
};

export default PreviewProduct;
