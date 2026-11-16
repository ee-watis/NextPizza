import { Container, Filters, ProductsGroupList, Stories, Title, TopBar } from "@/shared/components/shared";
import { Suspense } from "react";
import { findPizzas, GetSearchParams } from "@/shared/lib/find-pizza";

export default async function Home({ searchParams } : {searchParams: Promise<GetSearchParams>}) {
  const resolvedSearchParams = await searchParams;
  const categories = await findPizzas(resolvedSearchParams);

  return (
    <>
      <Container className="mt-10">
        <Title text="Всі піцци" size="lg" className="font-extrabold"/>
      </Container>

      <TopBar categories={categories.filter((category) => category.products.length > 0)}/>

      <Stories />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">

          <div className="w-[250px]">
            <Suspense>
              <Filters />
            </Suspense>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-16">
                {categories.map((category) => (
                  category.products.length > 0 && (
                    <ProductsGroupList
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      items={category.products}
                    />
                    
                  )))
                }
            </div>

            {/* <div className="flex items-center gap-6 mt-12">
              <Pagination pageCount={3} />
              <span className="text-sm text-gray-400">5 из 65</span>
            </div> */}
          </div>
        </div>
      </Container>

    </>
  );
}
