Rails.application.routes.draw do
  scope :api do
    scope :v1 do
      post   'builds'                   => 'releases#build'
      get    'apps'                     => 'apps#index'
      post   'apps'                     => 'apps#create'
      get    'apps/:app'                => 'apps#show'
      delete 'apps/:app'                => 'apps#destroy'
      post   'apps/:app/:stage/builds'  => 'releases#build'
      post   'apps/:app/:stage/promote' => 'releases#promote'
      post   'apps/:app/:stage/release' => 'releases#release'
      delete 'apps/:app/:stage/release' => 'releases#remove'
    end
  end
end
