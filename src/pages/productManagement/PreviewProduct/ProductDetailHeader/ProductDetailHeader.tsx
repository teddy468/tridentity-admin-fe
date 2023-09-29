import { useEffect, useState } from "react";
import { OutlineStarIcon } from "../../../../assets/icons";
import { productManagementService } from "../../../../services/product-management";
import InputQuantity from "../../InputQuantity/InputQuantity";
import PrimaryButton from "../../PrimaryButton/PrimaryButton";
import {
  formatPrice,
  MerchantStoreAddress,
  ProductAttribute,
  SelectedVariant,
} from "../PreviewProduct";
import ProductVariants from "../ProductVariants/ProductVariants";
import styles from "./product-detail-header.module.scss";
import { isEqual } from "lodash";

interface ProductDetailHeaderProps {
  images: string[];
  name: string;
  price: number;
  description: string;
  hashtags?: string[];
  attributes: ProductAttribute[];
  oldSelectedVariants: SelectedVariant[];
  setSelectedVariantProductBeforeUpdate: (variant: SelectedVariant) => void;
  selectedVariants: SelectedVariant[];
  setSelectedVariant: (variant: SelectedVariant) => void;
  merchant_store_id: number;
  tag: string;
  productBeforeUpdate?: Product;
  isHighline: boolean;
}
const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  images,
  name,
  price,
  description,
  hashtags,
  attributes,
  selectedVariants,
  setSelectedVariant,
  setSelectedVariantProductBeforeUpdate,
  oldSelectedVariants,
  merchant_store_id,
  tag,
  productBeforeUpdate,
  isHighline,
}: ProductDetailHeaderProps) => {
  const [currentImage, setCurrentImage] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [oldAvaiableQuantity, setOldAvailableQuantity] = useState(0);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wantToSeeMore, setWantToSeeMore] = useState(false);
  const [addresses, setAddress] = useState<MerchantStoreAddress[]>([]);

  useEffect(() => {
    fetchStoreAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchant_store_id]);
  function handleSeemore() {
    if (wantToSeeMore) {
      return description;
    } else {
      return description.split(" ").slice(0, 30).join(" ");
    }
  }
  function toggleSeeMore() {
    setWantToSeeMore(!wantToSeeMore);
  }
  const fetchStoreAddress = async () => {
    try {
      const result = await productManagementService.getStoreAddress(
        merchant_store_id
      );
      setAddress(result);
    } catch (error) {}
  };

  useEffect(() => {
    const newPrice = selectedVariants.reduce(
      (total, variant) => total + Number(variant.price),
      0
    );
    setProductPrice(newPrice);
  }, [selectedVariants, price]);

  useEffect(() => {
    const minQuantity = Math.min(
      ...selectedVariants.map(
        (variant: SelectedVariant) => variant.total_quantity
      )
    );
    const oldMinQuantity = Math.min(
      ...oldSelectedVariants.map((variant) => variant.total_quantity)
    );
    setOldAvailableQuantity(oldMinQuantity);
    setAvailableQuantity(minQuantity);
  }, [selectedVariants]);

  useEffect(() => {
    if (images.length > 0) {
      setCurrentImage(images[0]);
    }
  }, [images]);
  function handleDifferent(oldValue: any, newValue: any, currenClass: any) {
    if (!isHighline) {
      return currenClass;
    }
    if (isEqual(oldValue, newValue)) {
      return currenClass;
    } else {
      return currenClass + " " + styles.different;
    }
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <div className={styles.activeImage}>
          <img src={currentImage} alt="name" />
          <div className={styles.tag}>{tag}</div>
        </div>
        <div className={styles.smallImages}>
          {images.slice(0, 4).map((image, index) => (
            <img
              onClick={() => setCurrentImage(image)}
              src={image}
              key={index}
              alt="product"
            />
          ))}
        </div>
        <div className={styles.description}>
          <div className={styles.label}>Description</div>
          <div
            className={`${
              productBeforeUpdate
                ? handleDifferent(
                    description,
                    productBeforeUpdate.description,
                    styles.cotent
                  )
                : styles.content
            }`}
          >
            {description.length > 100 ? (
              <>
                {handleSeemore()}
                <span className={styles.seeMoreBtn} onClick={toggleSeeMore}>
                  .See more
                </span>
              </>
            ) : (
              description
            )}
          </div>
        </div>
        <div className={styles.hashtagsWrapper}>
          <span className={styles.label}>Hashtags: </span>{" "}
          <span className={styles.hashtags}>
            {hashtags?.map((hashTag) => (
              <span>{hashTag}</span>
            ))}
          </span>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.nameWrapper}>
          <div
            className={`${
              productBeforeUpdate
                ? handleDifferent(
                    name,
                    productBeforeUpdate.name,
                    styles.productName
                  )
                : styles.productName
            }`}
          >
            {name}
          </div>
          <div className={styles.rating}>
            <div className={styles.star}>
              {new Array(5).fill(0).map((_, index) => (
                <OutlineStarIcon key={index} />
              ))}
            </div>
            <div className={styles.review}>0 review</div>
          </div>
          <div
            className={`${
              productBeforeUpdate
                ? handleDifferent(
                    productPrice,
                    productBeforeUpdate.price,
                    styles.price
                  )
                : styles.price
            }`}
          >
            {formatPrice(productPrice)}
          </div>
        </div>
        <div className={styles.deliveryInfo}>
          <div className={styles.label}>Delivered from</div>
          <div className={styles.addresses}>
            {addresses.map((item) => (
              <div className={styles.address}>
                {item.address}, {item.district}, {item.city_or_province},{" "}
                {item.country}
              </div>
            ))}
          </div>
        </div>
        <ProductVariants
          isHighline={isHighline}
          oldAttributes={productBeforeUpdate?.attributes}
          attributes={attributes}
          selectedVariants={selectedVariants}
          setSelectedVariant={setSelectedVariant}
          oldSelectedVariants={oldSelectedVariants}
          setSelectedVariantProductBeforeUpdate={
            setSelectedVariantProductBeforeUpdate
          }
        />
        <div>
          <div className={styles.label}>Quantity</div>
          <div className={styles.quantityWrapper}>
            <InputQuantity
              quantity={quantity}
              onChange={setQuantity}
              max={availableQuantity}
            />
            <span
              className={`${
                productBeforeUpdate
                  ? handleDifferent(availableQuantity, oldAvaiableQuantity, "")
                  : ""
              }`}
            >
              {new Intl.NumberFormat("en-US", {
                maximumSignificantDigits: 3,
              }).format(availableQuantity)}{" "}
              available
            </span>
          </div>
        </div>
        <PrimaryButton>Add to cart</PrimaryButton>
      </div>
    </div>
  );
};

export default ProductDetailHeader;
