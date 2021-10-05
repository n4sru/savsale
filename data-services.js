(function () {
  const databaseRef = firebase.database().ref();
  const storageRef = firebase.storage();

  async function createProduct(productData) {
    // Get a key for a new Post.
    var newProductKey = databaseRef.child("products").push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};

    const images = await uploadImages(productData.images, newProductKey);

    updates["/products/" + newProductKey] = { ...productData, images };

    await databaseRef.update(updates);

    return {
      ...productData,
      key: newProductKey,
      images,
    };
  }

  async function fetchProducts(category) {
    var products = [];
    var data = await databaseRef
      .child("products")
      .orderByChild("date")
      .once("value", (data) => data);
    data.forEach((item) => {
      const { key } = item;
      var product = {
        key,
        ...item.val(),
      };

      if (!category) {
        products.push(product);
        return;
      }

      if (category && product.category === category) products.push(product);
    });

    return products.reverse();
  }

  async function removeProductByKey(key) {
    console.log("Deleted item key", key);
    var target = databaseRef.ref(`products/${key}`);

    return await target.remove();
  }

  async function uploadImages(files, productKey) {
    var promises = null;

    if (files instanceof FileList) {
      const filesList = Array.from(files);
      promises = filesList.map((file, index) => {
        const fragments = file.name.split(".");
        const ext = fragments[fragments.length - 1];
        const fileName = `image-${index}.${ext}`;

        return storageRef.ref(`images/${productKey}`).child(fileName).put(file);
      });
    }

    const results = await Promise.all(promises);
    const imagesUrlsPromises = results.map((result) =>
      result.ref.getDownloadURL()
    );
    const imagesUrls = await Promise.all(imagesUrlsPromises);

    console.log(
      "TCL ~ file: data-services.js ~ line 66 ~ uploadImages ~ imagesUrls",
      imagesUrls
    );
    return imagesUrls;
  }

  // async function

  window.uploadImages = uploadImages;
  window.removeProductByKey = removeProductByKey;
  window.createProduct = createProduct;
  window.fetchProducts = fetchProducts;
})();
